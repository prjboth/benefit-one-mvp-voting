import { useState, useEffect } from 'react'
import { getLanguage, setLanguage } from '../utils/i18n'

function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(getLanguage())

  useEffect(() => {
    setCurrentLang(getLanguage())
    // Listen for language changes
    const handleStorageChange = () => {
      setCurrentLang(getLanguage())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCurrentLang(lang)
    // Trigger a custom event to notify components
    window.dispatchEvent(new Event('languagechange'))
    // Force re-render by reloading
    window.location.reload()
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('th')}
        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
          currentLang === 'th'
            ? 'bg-red-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ไทย
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
          currentLang === 'en'
            ? 'bg-red-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher

