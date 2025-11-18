import { useState, useEffect } from 'react'
import { getMembers, saveMembers, resetAllVotes, getVoteCount } from '../utils/storage'
import { t } from '../utils/i18n'

function Import() {
  const [members, setMembers] = useState([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberPhoto, setNewMemberPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPhoto, setEditPhoto] = useState(null)
  const [editPhotoPreview, setEditPhotoPreview] = useState(null)
  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    loadMembers()
    updateVoteCount()
  }, [])

  const updateVoteCount = () => {
    setVoteCount(getVoteCount())
  }

  const loadMembers = () => {
    const loadedMembers = getMembers()
    setMembers(loadedMembers)
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

  const handleAddMember = (e) => {
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

    const updatedMembers = [...members, newMember]
    saveMembers(updatedMembers)
    setMembers(updatedMembers)
    setNewMemberName('')
    setNewMemberPhoto(null)
    setPhotoPreview(null)
    document.getElementById('photo-input').value = ''
  }

  const handleDeleteMember = (id) => {
    if (window.confirm(t('import.deleteConfirm'))) {
      const updatedMembers = members.filter(m => m.id !== id)
      saveMembers(updatedMembers)
      setMembers(updatedMembers)
    }
  }

  const handleStartEdit = (member) => {
    setEditingId(member.id)
    setEditName(member.name)
    setEditPhoto(member.photo)
    setEditPhotoPreview(member.photo)
  }

  const handleSaveEdit = (id) => {
    if (!editName.trim()) {
      alert(t('import.alertMemberName'))
      return
    }

    const updatedMembers = members.map(m => 
      m.id === id 
        ? { ...m, name: editName.trim(), photo: editPhoto }
        : m
    )
    saveMembers(updatedMembers)
    setMembers(updatedMembers)
    setEditingId(null)
    setEditName('')
    setEditPhoto(null)
    setEditPhotoPreview(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditPhoto(null)
    setEditPhotoPreview(null)
  }

  const handleImportCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
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
        const updatedMembers = [...members, ...importedMembers]
        saveMembers(updatedMembers)
        setMembers(updatedMembers)
        alert(`${t('import.importSuccess')} ${importedMembers.length} ${t('import.people')}`)
      }
    }
    reader.readAsText(file)
  }

  const handleResetVotes = () => {
    const confirmMessage = t('import.resetVotesConfirm')
    if (window.confirm(confirmMessage)) {
      resetAllVotes()
      updateVoteCount()
      alert(t('import.resetVotesSuccess'))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            {t('import.title')}
          </h2>
          <p className="text-gray-600">{t('import.subtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">{t('import.totalVotes')}</p>
          <p className="text-2xl font-bold text-red-600">{voteCount}</p>
        </div>
      </div>

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
    </div>
  )
}

export default Import
