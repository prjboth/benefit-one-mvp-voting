import { useState, useEffect } from 'react'
import { getMembers } from '../utils/storage'
import { saveVote } from '../utils/storage'
import { t } from '../utils/i18n'

function Voting() {
  const [members, setMembers] = useState([])
  const [scores, setScores] = useState({})
  const [totalScore, setTotalScore] = useState(0)
  const [voterName, setVoterName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showDescription, setShowDescription] = useState(true)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const loadedMembers = await getMembers()
        setMembers(loadedMembers)
        
        // Initialize scores
        const initialScores = {}
        loadedMembers.forEach(member => {
          initialScores[member.id] = 0
        })
        setScores(initialScores)
      } catch (error) {
        console.error('Failed to load members:', error)
        setMembers([])
      }
    }
    
    loadMembers()
  }, [])

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, score) => sum + Number(score || 0), 0)
    setTotalScore(total)
  }, [scores])

  const handleScoreChange = (memberId, value) => {
    const numValue = Math.max(0, Math.min(100, Number(value) || 0))
    const newScores = { ...scores, [memberId]: numValue }
    const newTotal = Object.values(newScores).reduce((sum, score) => sum + Number(score || 0), 0)
    
    if (newTotal <= 100) {
      setScores(newScores)
    } else {
      // Auto-adjust if exceeds 100
      const remaining = 100 - (totalScore - (scores[memberId] || 0))
      setScores({ ...scores, [memberId]: Math.min(numValue, remaining) })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!voterName.trim()) {
      alert(t('voting.alertVoterName'))
      return
    }
    
    if (totalScore === 0) {
      alert(t('voting.alertNoScore'))
      return
    }

    try {
      await saveVote({
        voterName: voterName.trim(),
        scores: scores
      })

      setSubmitted(true)
      setTimeout(() => {
        setScores({})
        setVoterName('')
        setSubmitted(false)
        // Reset scores
        const initialScores = {}
        members.forEach(member => {
          initialScores[member.id] = 0
        })
        setScores(initialScores)
      }, 2000)
    } catch (error) {
      alert('Failed to submit vote. Please try again. / ส่งการโหวตไม่สำเร็จ กรุณาลองอีกครั้ง')
      console.error('Vote submission error:', error)
    }
  }

  const remainingPoints = 100 - totalScore

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">{t('voting.noMembers')}</p>
        <a href="/import" className="text-red-600 hover:text-red-800 font-semibold">
          {t('voting.goToImport')}
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('voting.title')}</h2>
      
      {/* Description Section */}
      {showDescription && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-red-800 mb-2">📋 {t('voting.title')} - {t('voting.showInstructions')}</h3>
            <button
              onClick={() => setShowDescription(false)}
              className="text-red-600 hover:text-red-800 font-bold text-xl"
            >
              ×
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {t('voting.description')}
          </div>
        </div>
      )}

      {!showDescription && (
        <button
          onClick={() => setShowDescription(true)}
          className="mb-4 text-red-600 hover:text-red-800 text-sm font-semibold flex items-center"
        >
          <span className="mr-1">📋</span>
          {t('voting.title')} - {t('voting.showInstructions')}
        </button>
      )}
      
      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {t('voting.success')}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('voting.voterName')} *
          </label>
          <input
            type="text"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder={t('voting.voterNamePlaceholder')}
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">{t('voting.distributePoints')}</h3>
            <div className={`text-lg font-bold ${remainingPoints < 0 ? 'text-red-600' : remainingPoints === 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {t('voting.pointsUsed')}: {totalScore} / 100
              {remainingPoints >= 0 && ` (${t('voting.remaining')} ${remainingPoints})`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <span className="text-red-600 font-bold text-xl">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scores[member.id] || 0}
                    onChange={(e) => handleScoreChange(member.id, e.target.value)}
                    className="w-full py-2 px-3 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0"
                  />
                  <span className="ml-2 text-gray-600">{t('voting.points')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={totalScore > 100 || totalScore === 0 || !voterName.trim()}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              totalScore > 100 || totalScore === 0 || !voterName.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            } transition-all duration-200`}
          >
            {t('voting.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Voting
