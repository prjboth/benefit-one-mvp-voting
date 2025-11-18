import { useState, useEffect } from 'react'
import { getMembers, addMember, updateMember, deleteMember, resetAllVotes, getVoteCount, getVoteLogs } from '../utils/storage'
import { api } from '../utils/api'
import { t } from '../utils/i18n'

function Config() {
  const [activeTab, setActiveTab] = useState('members') // 'members', 'logs', or 'password'
  const [members, setMembers] = useState([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberPhoto, setNewMemberPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPhoto, setEditPhoto] = useState(null)
  const [editPhotoPreview, setEditPhotoPreview] = useState(null)
  const [voteCount, setVoteCount] = useState(0)
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(false)
  // Password reset states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    loadMembers()
    updateVoteCount()
  }, [])

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs()
    }
  }, [activeTab])

  const updateVoteCount = async () => {
    try {
      const count = await getVoteCount()
      setVoteCount(count)
    } catch (error) {
      console.error('Failed to get vote count:', error)
      setVoteCount(0)
    }
  }

  const loadMembers = async () => {
    try {
      const loadedMembers = await getMembers()
      setMembers(loadedMembers)
    } catch (error) {
      console.error('Failed to load members:', error)
      setMembers([])
    }
  }

  const loadLogs = async () => {
    try {
      setLogsLoading(true)
      const data = await getVoteLogs()
      console.log('Loaded logs:', data)
      setLogs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load logs:', error)
      setLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  const handlePhotoChange = (e, isEdit = false) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file must not exceed 5MB / ไฟล์รูปภาพต้องไม่เกิน 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isEdit) {
          setEditPhoto(reader.result)
          setEditPhotoPreview(reader.result)
        } else {
          setNewMemberPhoto(reader.result)
          setPhotoPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!newMemberName.trim()) {
      alert(t('import.alertMemberName'))
      return
    }

    const newMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      photo: newMemberPhoto || null
    }

    try {
      await addMember(newMember)
      await loadMembers() // Reload members
      setNewMemberName('')
      setNewMemberPhoto(null)
      setPhotoPreview(null)
      const photoInput = document.getElementById('photo-input')
      if (photoInput) photoInput.value = ''
    } catch (error) {
      alert('Failed to add member. Please try again. / เพิ่มสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง')
      console.error('Add member error:', error)
    }
  }

  const handleDeleteMember = async (id) => {
    if (window.confirm(t('import.deleteConfirm'))) {
      try {
        await deleteMember(id)
        await loadMembers() // Reload members after delete
      } catch (error) {
        alert('Failed to delete member. Please try again. / ลบสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง')
        console.error('Delete member error:', error)
      }
    }
  }

  const handleStartEdit = (member) => {
    setEditingId(member.id)
    setEditName(member.name)
    setEditPhoto(member.photo)
    setEditPhotoPreview(member.photo)
  }

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      alert(t('import.alertMemberName'))
      return
    }

    try {
      await updateMember(id, {
        name: editName.trim(),
        photo: editPhoto
      })
      await loadMembers() // Reload members
      setEditingId(null)
      setEditName('')
      setEditPhoto(null)
      setEditPhotoPreview(null)
    } catch (error) {
      alert('Failed to update member. Please try again. / แก้ไขสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง')
      console.error('Update member error:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditPhoto(null)
    setEditPhotoPreview(null)
  }

  const handleImportCSV = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target.result
      const lines = text.split('\n').filter(line => line.trim())
      
      const importedMembers = []
      lines.forEach((line, index) => {
        if (index === 0 && line.toLowerCase().includes('name')) return // Skip header
        
        const name = line.trim()
        if (name) {
          importedMembers.push({
            id: `imported-${Date.now()}-${index}`,
            name: name,
            photo: null
          })
        }
      })

      if (importedMembers.length > 0) {
        try {
          // Add each member via API
          for (const member of importedMembers) {
            await addMember(member)
          }
          await loadMembers() // Reload members
          alert(`${t('import.importSuccess')} ${importedMembers.length} ${t('import.people')}`)
        } catch (error) {
          alert('Failed to import members. Please try again. / นำเข้าสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง')
          console.error('Import CSV error:', error)
        }
      }
    }
    reader.readAsText(file)
  }

  const handleResetVotes = async () => {
    const confirmMessage = t('import.resetVotesConfirm')
    if (window.confirm(confirmMessage)) {
      try {
        await resetAllVotes()
        await updateVoteCount()
        alert(t('import.resetVotesSuccess'))
      } catch (error) {
        alert('Failed to reset votes. Please try again. / รีเซ็ตการโหวตไม่สำเร็จ กรุณาลองอีกครั้ง')
        console.error('Reset votes error:', error)
      }
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('config.passwordRequired') || 'All fields are required / กรุณากรอกข้อมูลครบถ้วน')
      return
    }

    if (newPassword.length < 4) {
      setPasswordError(t('config.passwordMinLength') || 'Password must be at least 4 characters / รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('config.passwordMismatch') || 'New passwords do not match / รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }

    setPasswordLoading(true)
    try {
      console.log('Resetting password...', { currentPassword: '***', newPassword: '***' })
      const result = await api.resetAdminPassword(currentPassword, newPassword)
      console.log('Reset password result:', result)
      
      setPasswordSuccess(t('config.passwordResetSuccess') || 'Password reset successfully! Page will reload... / รีเซ็ตรหัสผ่านสำเร็จ! ระบบจะรีโหลดหน้าเว็บ...')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Clear session to force re-authentication
      setTimeout(() => {
        sessionStorage.removeItem('adminAuthenticated')
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error.message || 'Failed to reset password / รีเซ็ตรหัสผ่านไม่สำเร็จ'
      if (errorMessage.includes('401') || errorMessage.includes('incorrect')) {
        setPasswordError(t('config.currentPasswordIncorrect') || 'Current password is incorrect / รหัสผ่านปัจจุบันไม่ถูกต้อง')
      } else {
        setPasswordError(errorMessage)
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            ⚙️ Config / การตั้งค่า
          </h2>
          <p className="text-gray-600">จัดการสมาชิกและดูบันทึกการโหวต</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">{t('import.totalVotes')}</p>
          <p className="text-2xl font-bold text-red-600">{voteCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            👥 Members / สมาชิก
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📋 Logs / บันทึกการโหวต
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔐 {t('config.resetPassword') || 'Reset Password / รีเซ็ตรหัสผ่าน'}
          </button>
        </nav>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <>
          {/* Reset Votes Section */}
          <div className="mb-8 border-2 border-red-200 rounded-xl p-6 bg-gradient-to-br from-red-50 to-white">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <span className="mr-2">⚙️</span>
              Configuration / การตั้งค่า
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-semibold mb-1">{t('import.resetVotes')}</p>
                <p className="text-sm text-gray-600">
                  {voteCount > 0 
                    ? `${voteCount} ${t('import.people')} ${t('import.totalVotes').toLowerCase()}`
                    : 'No votes yet / ยังไม่มีการโหวต'
                  }
                </p>
              </div>
              <button
                onClick={handleResetVotes}
                disabled={voteCount === 0}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 ${
                  voteCount === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                🔄 {t('import.resetVotes')}
              </button>
            </div>
          </div>

          {/* Add New Member Form */}
          <div className="mb-8 border-2 border-red-100 rounded-xl p-6 bg-gradient-to-br from-red-50 to-white">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <span className="mr-2">➕</span>
              {t('import.addMember')}
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {t('import.memberName')} *
                  </label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="shadow appearance-none border-2 border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    placeholder="กรอกชื่อสมาชิก"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {t('import.photo')}
                  </label>
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, false)}
                    className="shadow appearance-none border-2 border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  />
                </div>
              </div>
              
              {photoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">{t('import.photoPreview')}:</p>
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-red-300 shadow-md"
                  />
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 font-semibold"
              >
                ➕ {t('import.add')}
              </button>
            </form>
          </div>

          {/* Import CSV */}
          <div className="mb-8 border-2 border-red-100 rounded-xl p-6 bg-gradient-to-br from-red-50 to-white">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <span className="mr-2">📁</span>
              {t('import.importCSV')}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t('import.csvDescription')}
            </p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleImportCSV}
              className="shadow appearance-none border-2 border-gray-300 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
          </div>

          {/* Members List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <span className="mr-2">👥</span>
              {t('import.allMembers')} ({members.length} {t('import.people')})
            </h3>
            
            {members.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">{t('import.noMembers')}</p>
                <p className="text-gray-400 text-sm mt-2">{t('import.startAdding')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(member => (
                  <div key={member.id} className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-red-300 transition-all bg-white">
                    {editingId === member.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoChange(e, true)}
                          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        {editPhotoPreview && (
                          <img 
                            src={editPhotoPreview} 
                            alt="Preview" 
                            className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-red-300"
                          />
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(member.id)}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors"
                          >
                            💾 {t('import.save')}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-semibold transition-colors"
                          >
                            ❌ {t('import.cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center mb-3">
                          {member.photo ? (
                            <img 
                              src={member.photo} 
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover mr-3 border-2 border-red-200 shadow-md"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mr-3 border-2 border-red-200 shadow-md">
                              <span className="text-red-600 font-bold text-xl">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <h4 className="font-semibold text-gray-800 flex-1">{member.name}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(member)}
                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                          >
                            ✏️ {t('import.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                          >
                            🗑️ {t('import.delete')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Password Reset Tab */}
      {activeTab === 'password' && (
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-8 border-2 border-red-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">🔐</span>
            {t('config.resetPassword') || 'Reset Admin Password / รีเซ็ตรหัสผ่าน Admin'}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('config.resetPasswordDescription') || 'Change the admin password for accessing protected pages. / เปลี่ยนรหัสผ่าน Admin สำหรับเข้าถึงหน้าที่ต้องการรหัสผ่าน'}
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6 max-w-md">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t('config.currentPassword') || 'Current Password / รหัสผ่านปัจจุบัน'}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  setPasswordError('')
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={t('config.currentPasswordPlaceholder') || 'Enter current password'}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t('config.newPassword') || 'New Password / รหัสผ่านใหม่'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setPasswordError('')
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={t('config.newPasswordPlaceholder') || 'Enter new password (min 4 characters)'}
                minLength={4}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('config.passwordMinLengthHint') || 'Minimum 4 characters / อย่างน้อย 4 ตัวอักษร'}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t('config.confirmPassword') || 'Confirm New Password / ยืนยันรหัสผ่านใหม่'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setPasswordError('')
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={t('config.confirmPasswordPlaceholder') || 'Confirm new password'}
                minLength={4}
                required
              />
            </div>

            {passwordError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </p>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {passwordSuccess}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
            >
              {passwordLoading 
                ? (t('config.resetting') || 'Resetting... / กำลังรีเซ็ต...') 
                : (t('config.resetPassword') || 'Reset Password / รีเซ็ตรหัสผ่าน')
              }
            </button>
          </form>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">📋 Vote Logs / บันทึกการโหวต</h3>
            <button
              onClick={loadLogs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          {logsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading logs... / กำลังโหลด...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No logs yet / ยังไม่มีบันทึก</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-50 border-b-2 border-red-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time / เวลา</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Voter / ผู้โหวต</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member / สมาชิก</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Score / คะแนน</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr 
                      key={index}
                      className="border-b border-gray-200 hover:bg-red-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {log.voterName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {log.memberName}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                        {log.score} {t('voting.points')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Config

