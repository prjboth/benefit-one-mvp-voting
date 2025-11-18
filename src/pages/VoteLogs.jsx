import { useState, useEffect } from 'react'
import { getVoteLogs } from '../utils/storage'
import { t } from '../utils/i18n'
import PasswordProtection from '../components/PasswordProtection'

function VoteLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const data = await getVoteLogs()
      setLogs(data)
    } catch (error) {
      console.error('Failed to load logs:', error)
      setLogs([])
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-600">Loading logs... / กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          📋 Vote Logs / บันทึกการโหวต
        </h2>
        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {logs.length === 0 ? (
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
  )
}

// Export with password protection
export default function VoteLogsProtected() {
  return (
    <PasswordProtection>
      <VoteLogs />
    </PasswordProtection>
  )
}

