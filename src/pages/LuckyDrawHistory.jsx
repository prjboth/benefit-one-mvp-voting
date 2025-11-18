import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { t } from '../utils/i18n'

function LuckyDrawHistory() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const history = await api.getLuckyDrawLogs()
      setLogs(history)
    } catch (error) {
      console.error('Failed to load lucky draw history:', error)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      return timestamp
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('luckyDrawHistory.loading') || 'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          📜 {t('luckyDrawHistory.title')}
        </h2>
        <p className="text-gray-600">{t('luckyDrawHistory.subtitle')}</p>
      </div>

      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/lucky-draw"
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 font-semibold"
        >
          ← {t('luckyDrawHistory.backToDraw')}
        </Link>
      </div>

      {/* History List */}
      {logs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 text-lg">{t('luckyDrawHistory.noHistory')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log, index) => (
            <div
              key={log.drawId}
              className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-102"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: Date and Count */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎲</span>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">{t('luckyDrawHistory.drawDate')}</p>
                      <p className="text-lg font-bold text-gray-800">{formatDate(log.timestamp)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 font-semibold">{t('luckyDrawHistory.winnerCount')}: </span>
                    <span className="text-xl font-bold text-red-600">{log.drawCount || log.winners.length}</span>
                  </div>
                </div>

                {/* Right: Winners */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-3">{t('luckyDrawHistory.winners')}:</p>
                  <div className="flex flex-wrap gap-3">
                    {log.winners.map((winner, winnerIndex) => (
                      <div
                        key={winner.id || winnerIndex}
                        className="bg-white rounded-lg p-3 border-2 border-red-300 shadow-md flex items-center gap-3 min-w-[150px]"
                      >
                        {winner.photo ? (
                          <img
                            src={winner.photo}
                            alt={winner.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-red-400"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-200 to-pink-300 flex items-center justify-center border-2 border-red-400">
                            <span className="text-red-700 font-bold text-lg">
                              {winner.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{winner.name}</p>
                          {log.drawCount > 1 && (
                            <p className="text-xs text-gray-500">#{winnerIndex + 1}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {logs.length > 0 && (
        <div className="mt-8 pt-8 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <p className="text-sm text-gray-600 font-semibold">{t('luckyDrawHistory.totalDraws') || 'Total Draws'}</p>
              <p className="text-3xl font-bold text-red-600">{logs.length}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
              <p className="text-sm text-gray-600 font-semibold">{t('luckyDrawHistory.totalWinners') || 'Total Winners'}</p>
              <p className="text-3xl font-bold text-pink-600">
                {logs.reduce((sum, log) => sum + (log.drawCount || log.winners.length), 0)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <p className="text-sm text-gray-600 font-semibold">{t('luckyDrawHistory.averagePerDraw') || 'Avg per Draw'}</p>
              <p className="text-3xl font-bold text-yellow-600">
                {logs.length > 0 
                  ? (logs.reduce((sum, log) => sum + (log.drawCount || log.winners.length), 0) / logs.length).toFixed(1)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LuckyDrawHistory

