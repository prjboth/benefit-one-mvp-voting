import { useState, useEffect } from 'react'
import { calculateResults, getAllVotes } from '../utils/storage'
import { t } from '../utils/i18n'

function Results() {
  const [results, setResults] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Show exciting loading animation first
    setShowLoading(true)
    setTimeout(() => {
      loadResults()
      setShowLoading(false)
      // Trigger animation after loading
      setTimeout(() => setIsLoaded(true), 300)
    }, 1500) // 1.5 seconds of suspense
  }, [])

  const loadResults = async () => {
    try {
      console.log('Loading results...')
      const data = await calculateResults()
      console.log('Results data received:', data)
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data))
      
      // calculateResults now returns { results, totalVotes } from API
      if (Array.isArray(data)) {
        // Fallback for localStorage (should not happen in production)
        console.log('Using localStorage fallback (array format)')
        setResults(data.slice(0, 3)) // Show only top 3
        const votes = await getAllVotes()
        setTotalVotes(Array.isArray(votes) ? votes.length : 0)
      } else if (data && typeof data === 'object' && 'results' in data) {
        // API response format: { results: [...], totalVotes: number }
        console.log('Using API response format')
        const resultsArray = Array.isArray(data.results) ? data.results : []
        console.log('Results array:', resultsArray)
        console.log('Total votes:', data.totalVotes)
        setResults(resultsArray) // Already top 3 from API
        setTotalVotes(data.totalVotes || 0)
      } else {
        console.warn('Unexpected data format:', data)
        setResults([])
        setTotalVotes(0)
      }
      setIsLoaded(false)
    } catch (error) {
      console.error('Failed to load results:', error)
      console.error('Error details:', error.message, error.stack)
      setResults([])
      setTotalVotes(0)
      setIsLoaded(false)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 shadow-lg'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400 shadow-md'
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400 shadow-md'
    return 'bg-white border-gray-200'
  }

  // Exciting loading animation
  if (showLoading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            {/* Spinning trophy */}
            <div className="text-8xl animate-spin" style={{ animationDuration: '1s' }}>
              🏆
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-red-300 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-red-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-red-600 mt-8 animate-pulse">
            {t('results.title')}
          </h3>
          <p className="text-gray-600 mt-2 text-lg animate-pulse">Calculating results... / กำลังคำนวณผลการโหวต...</p>
          <div className="mt-6 w-64 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-600 text-lg">{t('results.noResults')}</p>
        <p className="text-gray-500 mt-2">{t('results.voteFirst')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Animated Header */}
      <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              🏆 {t('results.title')} - Top 3
            </h2>
            <p className="text-gray-600">{t('results.subtitle')}</p>
          </div>
          <div className="text-center md:text-right bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <p className="text-gray-600 text-sm mb-1">{t('results.totalVoters')}</p>
            <p className="text-3xl font-bold text-red-600">{totalVotes} {t('results.people')}</p>
          </div>
        </div>

        {/* Animated Trophy Banner */}
        <div className={`bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-xl p-6 text-white shadow-2xl mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-1">{t('results.congratulations')}</h3>
              <p className="text-red-100">{t('results.winnerMessage')}</p>
            </div>
            <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏆</div>
          </div>
        </div>
      </div>

      {/* Results List with Animation - Only Top 3 */}
      <div className="space-y-4">
        {results.map((member, index) => {
          const rank = index + 1
          const percentage = totalVotes > 0 ? ((member.totalScore / (totalVotes * 100)) * 100).toFixed(1) : 0
          const delay = index * 100
          
          return (
            <div
              key={member.id}
              className={`border-2 rounded-xl p-6 ${getRankColor(rank)} transition-all hover:shadow-xl transform hover:scale-105 duration-300 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ 
                transitionDelay: `${delay}ms`,
                animation: isLoaded ? 'slideInRight 0.5s ease-out' : 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="text-5xl mr-6 font-bold animate-pulse">
                    {getRankIcon(rank)}
                  </div>
                  
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mr-4 border-4 border-white shadow-xl transform hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center mr-4 border-4 border-white shadow-xl">
                      <span className="text-red-700 font-bold text-3xl">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                        <span className="text-gray-600 text-sm">{t('results.totalScore')}: </span>
                        <span className="text-2xl font-bold text-red-600">
                          {member.totalScore.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                        <span className="text-gray-600 text-sm">{t('results.average')}: </span>
                        <span className="text-xl font-semibold text-gray-700">
                          {totalVotes > 0 ? (member.totalScore / totalVotes).toFixed(2) : 0} {t('results.perPerson')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4 bg-white rounded-lg px-6 py-4 shadow-md">
                  <div className="text-4xl font-bold text-red-600 mb-1">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-500">{t('results.ofTotal')}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-6 rounded-full transition-all duration-1000 shadow-lg flex items-center justify-end pr-2"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      animation: isLoaded ? 'progressBar 1s ease-out' : 'none'
                    }}
                  >
                    {percentage > 10 && (
                      <span className="text-white text-xs font-bold">{percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setShowLoading(true)
            setIsLoaded(false)
            setTimeout(() => {
              loadResults()
              setShowLoading(false)
              setTimeout(() => setIsLoaded(true), 300)
            }, 1500)
          }}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 font-semibold"
        >
          🔄 {t('results.refresh')}
        </button>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes progressBar {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

export default Results
