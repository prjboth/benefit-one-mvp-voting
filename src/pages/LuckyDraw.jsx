import { useState, useEffect } from 'react'
import { getMembers } from '../utils/storage'
import { api } from '../utils/api'
import { t } from '../utils/i18n'

function LuckyDraw() {
  const [members, setMembers] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [winners, setWinners] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [animationStage, setAnimationStage] = useState(0) // 0: idle, 1: spinning, 2: result
  const [drawCount, setDrawCount] = useState(1) // Number of winners to draw
  const [currentSelection, setCurrentSelection] = useState(null)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const loadedMembers = await getMembers()
      setMembers(loadedMembers)
    } catch (error) {
      console.error('Failed to load members:', error)
      setMembers([])
    }
  }

  const startDraw = async () => {
    if (members.length === 0) {
      alert(t('luckyDraw.noMembers'))
      return
    }

    if (drawCount > members.length) {
      alert(t('luckyDraw.tooManyWinners'))
      return
    }

    setIsDrawing(true)
    setShowResult(false)
    setWinners([])
    setCurrentSelection(null)
    setAnimationStage(1)

    // Animation duration: 3-4 seconds depending on draw count
    const animationDuration = 3000 + (drawCount * 500)
    const startTime = Date.now()
    const interval = 50 // Update every 50ms

    const drawInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / animationDuration

      // Randomly select a member during animation
      const availableMembers = members.filter(m => !winners.some(w => w.id === m.id))
      if (availableMembers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMembers.length)
        setCurrentSelection(availableMembers[randomIndex])
      }

      if (progress >= 1) {
        clearInterval(drawInterval)
        // Final selection - draw multiple winners
        const selectedWinners = []
        const availableMembers = [...members]
        
        for (let i = 0; i < drawCount && availableMembers.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableMembers.length)
          selectedWinners.push(availableMembers[randomIndex])
          availableMembers.splice(randomIndex, 1) // Remove selected to avoid duplicates
        }
        
        setWinners(selectedWinners)
        setCurrentSelection(null)
        setAnimationStage(2)
        
        // Save to history
        saveDrawHistory(selectedWinners)
        
        setTimeout(() => {
          setIsDrawing(false)
          setShowResult(true)
        }, 500)
      }
    }, interval)
  }

  const saveDrawHistory = async (selectedWinners) => {
    try {
      const drawId = Date.now().toString()
      const timestamp = new Date().toISOString()
      
      await api.saveLuckyDrawLog({
        drawId,
        timestamp,
        winners: selectedWinners.map(w => ({
          id: w.id,
          name: w.name,
          photo: w.photo || null
        })),
        drawCount: selectedWinners.length
      })
      
      console.log('Lucky draw history saved:', drawId)
    } catch (error) {
      console.error('Failed to save lucky draw history:', error)
      // Don't show error to user, just log it
    }
  }

  const resetDraw = () => {
    setWinners([])
    setShowResult(false)
    setAnimationStage(0)
    setCurrentSelection(null)
  }

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">{t('luckyDraw.noMembers')}</p>
        <a href="/config" className="text-red-600 hover:text-red-800 font-semibold">
          {t('luckyDraw.goToConfig')} →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-red-600 via-pink-600 to-red-800 bg-clip-text text-transparent animate-pulse">
          🎲 {t('luckyDraw.title')}
        </h2>
        <p className="text-gray-600 text-lg">{t('luckyDraw.subtitle')}</p>
        <p className="text-sm text-gray-500 mt-2">
          {t('luckyDraw.totalMembers')}: <span className="font-bold text-red-600 text-lg">{members.length}</span>
        </p>
      </div>

      {/* Draw Count Selector */}
      {!isDrawing && !showResult && (
        <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
          <label className="block text-center text-gray-700 font-semibold mb-4 text-lg">
            {t('luckyDraw.selectCount')}
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setDrawCount(Math.max(1, drawCount - 1))}
              disabled={drawCount <= 1}
              className="w-12 h-12 rounded-full bg-red-600 text-white font-bold text-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              −
            </button>
            <div className="bg-white rounded-xl px-8 py-4 border-4 border-red-500 shadow-lg">
              <span className="text-4xl font-bold text-red-600">{drawCount}</span>
              <span className="text-gray-600 ml-2 text-lg">{t('luckyDraw.winners')}</span>
            </div>
            <button
              onClick={() => setDrawCount(Math.min(members.length, drawCount + 1))}
              disabled={drawCount >= members.length}
              className="w-12 h-12 rounded-full bg-red-600 text-white font-bold text-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Drawing Area */}
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!showResult && !isDrawing && (
          <div className="text-center">
            <div className="text-9xl mb-8 animate-bounce" style={{ animationDuration: '1s' }}>🎲</div>
            <button
              onClick={startDraw}
              className="px-16 py-5 bg-gradient-to-r from-red-600 via-pink-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:via-pink-700 hover:to-red-800 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-110 duration-300 font-bold text-2xl animate-pulse"
            >
              ✨ {t('luckyDraw.startDraw')} ✨
            </button>
          </div>
        )}

        {/* Enhanced Spinning Animation */}
        {isDrawing && animationStage === 1 && (
          <div className="text-center">
            <div className="relative mb-8">
              {/* Main spinning wheel with gradient */}
              <div className="w-80 h-80 rounded-full border-8 border-transparent bg-gradient-to-r from-red-500 via-pink-500 to-red-600 animate-spin" style={{ animationDuration: '0.08s' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-2">
                  <div className="text-7xl animate-pulse">🎯</div>
                </div>
              </div>
              
              {/* Multiple pulsing rings with different colors */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 border-4 border-red-300 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-88 h-88 border-4 border-pink-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.15s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 border-4 border-red-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.3s' }}></div>
              </div>
              
              {/* Sparkle effects */}
              <div className="absolute top-0 left-1/4 text-4xl animate-pulse" style={{ animationDelay: '0.1s' }}>✨</div>
              <div className="absolute top-1/4 right-0 text-4xl animate-pulse" style={{ animationDelay: '0.3s' }}>⭐</div>
              <div className="absolute bottom-0 left-0 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>💫</div>
              <div className="absolute bottom-1/4 right-1/4 text-4xl animate-pulse" style={{ animationDelay: '0.7s' }}>✨</div>
            </div>
            
            <h3 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent animate-pulse mb-6">
              {t('luckyDraw.drawing')}
            </h3>
            
            {currentSelection && (
              <div className="mt-6 animate-bounce">
                <p className="text-2xl text-gray-600 mb-3 font-semibold">{t('luckyDraw.currentSelection')}</p>
                <div className="inline-block bg-gradient-to-r from-red-50 to-pink-50 rounded-xl px-8 py-4 border-4 border-red-400 shadow-xl">
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {currentSelection.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Result Display */}
        {showResult && winners.length > 0 && (
          <div className={`text-center transition-all duration-1000 ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Enhanced Confetti Effect */}
            <div className="mb-8 relative">
              <div className="text-7xl animate-bounce">🎉</div>
              <div className="text-5xl animate-bounce mt-2" style={{ animationDelay: '0.1s' }}>🎊</div>
              <div className="text-6xl animate-bounce mt-2" style={{ animationDelay: '0.2s' }}>✨</div>
              <div className="text-5xl animate-bounce mt-2" style={{ animationDelay: '0.3s' }}>🌟</div>
            </div>

            {/* Winner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {winners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="bg-gradient-to-br from-yellow-50 via-pink-50 to-red-50 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-5xl mb-3">🏆</div>
                  {index === 0 && winners.length > 1 && (
                    <div className="text-sm font-bold text-yellow-600 mb-2 bg-yellow-200 rounded-full px-3 py-1 inline-block">
                      {t('luckyDraw.winner')} #{index + 1}
                    </div>
                  )}
                  
                  {winner.photo ? (
                    <img 
                      src={winner.photo} 
                      alt={winner.name}
                      className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-yellow-400 shadow-xl"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-300 via-pink-300 to-red-400 flex items-center justify-center mx-auto mb-4 border-4 border-yellow-400 shadow-xl">
                      <span className="text-red-700 font-bold text-5xl">
                        {winner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <h4 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {winner.name}
                  </h4>
                  <p className="text-gray-600">{t('luckyDraw.congratulations')}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={startDraw}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 duration-300 font-bold text-lg"
              >
                🔄 {t('luckyDraw.drawAgain')}
              </button>
              <button
                onClick={resetDraw}
                className="px-10 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 duration-300 font-bold text-lg"
              >
                {t('luckyDraw.reset')}
              </button>
              <a
                href="/lucky-draw-history"
                className="px-10 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 duration-300 font-bold text-lg"
              >
                📜 {t('luckyDraw.viewHistory')}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Members List (Optional - can be hidden) */}
      {!isDrawing && !showResult && (
        <div className="mt-8 border-t-2 border-gray-200 pt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {t('luckyDraw.allMembers')} ({members.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-gray-50 to-red-50 rounded-lg p-4 text-center border-2 border-gray-200 hover:border-red-400 hover:shadow-lg transition-all transform hover:scale-105"
              >
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-red-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-200 to-pink-300 flex items-center justify-center mx-auto mb-2 border-2 border-red-300">
                    <span className="text-red-700 font-bold text-xl">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-700">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LuckyDraw
