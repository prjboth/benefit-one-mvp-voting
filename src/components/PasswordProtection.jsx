import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { t } from '../utils/i18n'

function PasswordProtection({ children }) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await api.verifyAdminPassword(password)
      if (result.valid) {
        setIsAuthenticated(true)
        setError('')
        // Store authentication in sessionStorage (cleared on browser close)
        sessionStorage.setItem('adminAuthenticated', 'true')
      } else {
        setError(t('password.error'))
        setPassword('')
      }
    } catch (error) {
      console.error('Password verification error:', error)
      setError(t('password.error') || 'Invalid password')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  // Check if already authenticated in this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem('adminAuthenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  if (isAuthenticated) {
    return children
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('password.title')}</h2>
          <p className="text-gray-600">{t('password.description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('password.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
              }`}
              placeholder={t('password.passwordPlaceholder')}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            {loading ? t('password.verifying') || 'Verifying...' : t('password.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordProtection

