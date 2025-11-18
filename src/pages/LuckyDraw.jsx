import { useState, useEffect } from 'react'
import { getMembers } from '../utils/storage'
import { t } from '../utils/i18n'

function LuckyDraw() {
  const [members, setMembers] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [animationStage, setAnimationStage] = useState(0) // 0: idle, 1: spinning, 2: result

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

  const startDraw = () => {
    if (members.length === 0) {
      alert(t('luckyDraw.noMembers'))
      return
    }

    setIsDrawing(true)
    setShowResult(false)
    setWinner(null)
    setAnimationStage(1)

    // Animation duration: 3 seconds
    const animationDuration = 3000
    const startTime = Date.now()
    const interval = 50 // Update every 50ms

    const drawInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / animationDuration

      // Randomly select a member during animation
      const randomIndex = Math.floor(Math.random() * members.length)
      setWinner(members[randomIndex])

      if (progress >= 1) {
        clearInterval(drawInterval)
        // Final selection
        const finalIndex = Math.floor(Math.random() * members.length)
        setWinner(members[finalIndex])
        setAnimationStage(2)
        setTimeout(() => {
          setIsDrawing(false)
          setShowResult(true)
        }, 500)
      }
    }, interval)
  }

  const resetDraw = () => {
    setWinner(null)
    setShowResult(false)
    setAnimationStage(0)
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
        <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          🎲 {t('luckyDraw.title')}
        </h2>
        <p className="text-gray-600">{t('luckyDraw.subtitle')}</p>
        <p className="text-sm text-gray-500 mt-2">
          {t('luckyDraw.totalMembers')}: <span className="font-bold text-red-600">{members.length}</span>
        </p>
      </div>

      {/* Drawing Area */}
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!showResult && !isDrawing && (
          <div className="text-center">
            <div className="text-8xl mb-8 animate-bounce">🎲</div>
            <button
              onClick={startDraw}
              className="px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 duration-200 font-bold text-xl"
            >
              {t('luckyDraw.startDraw')}
            </button>
          </div>
        )}

        {/* Spinning Animation */}
        {isDrawing && animationStage === 1 && (
          <div className="text-center">
            <div className="relative mb-8">
              {/* Spinning wheel effect */}
              <div className="w-64 h-64 rounded-full border-8 border-red-500 animate-spin" style={{ animationDuration: '0.1s' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl animate-pulse">🎯</div>
                </div>
              </div>
              {/* Pulsing rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 border-4 border-red-300 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 border-4 border-red-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-red-600 animate-pulse mb-4">
              {t('luckyDraw.drawing')}
            </h3>
            {winner && (
              <div className="mt-4">
                <p className="text-xl text-gray-600 mb-2">{t('luckyDraw.currentSelection')}</p>
                <div className="inline-block bg-red-50 rounded-lg px-6 py-3 border-2 border-red-200">
                  <p className="text-2xl font-bold text-red-700">{winner.name}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {showResult && winner && (
          <div className={`text-center transition-all duration-1000 ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Confetti Effect */}
            <div className="mb-8">
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="text-4xl animate-bounce mt-2" style={{ animationDelay: '0.1s' }}>🎊</div>
              <div className="text-5xl animate-bounce mt-2" style={{ animationDelay: '0.2s' }}>✨</div>
            </div>

            {/* Winner Card */}
            <div className="bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-50 border-4 border-yellow-400 rounded-2xl p-8 shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('luckyDraw.winner')}</h3>
              
              {winner.photo ? (
                <img 
                  src={winner.photo} 
                  alt={winner.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-yellow-400 shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center mx-auto mb-4 border-4 border-yellow-400 shadow-xl">
                  <span className="text-red-700 font-bold text-5xl">
                    {winner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <h4 className="text-4xl font-bold text-red-700 mb-2">{winner.name}</h4>
              <p className="text-gray-600 text-lg">{t('luckyDraw.congratulations')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={startDraw}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 font-semibold"
              >
                🔄 {t('luckyDraw.drawAgain')}
              </button>
              <button
                onClick={resetDraw}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 font-semibold"
              >
                {t('luckyDraw.reset')}
              </button>
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
                className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200 hover:border-red-300 transition-all"
              >
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center mx-auto mb-2">
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

