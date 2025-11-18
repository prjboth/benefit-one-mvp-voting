import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Voting from './pages/Voting'
import Results from './pages/Results'
import Config from './pages/Config'
import LuckyDraw from './pages/LuckyDraw'
import LuckyDrawHistory from './pages/LuckyDrawHistory'
import PasswordProtection from './components/PasswordProtection'
import LanguageSwitcher from './components/LanguageSwitcher'
import { t } from './utils/i18n'

function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="https://benefit-one.co.th/wp-content/uploads/2025/04/Logo-1.png" 
                  alt="Benefit-One" 
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-red-300 hover:text-gray-700'
                }`}
              >
                {t('nav.vote')}
              </Link>
              <Link
                to="/results"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/results') 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-red-300 hover:text-gray-700'
                }`}
              >
                {t('nav.results')}
              </Link>
              <Link
                to="/lucky-draw"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/lucky-draw') 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-red-300 hover:text-gray-700'
                }`}
              >
                {t('nav.luckyDraw')}
              </Link>
              <Link
                to="/config"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/config') 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-red-300 hover:text-gray-700'
                }`}
              >
                ⚙️ Config
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Routes>
            <Route path="/" element={<Voting />} />
            <Route path="/results" element={<PasswordProtection><Results /></PasswordProtection>} />
            <Route path="/lucky-draw" element={<LuckyDraw />} />
            <Route path="/lucky-draw-history" element={<LuckyDrawHistory />} />
            <Route path="/config" element={<PasswordProtection><Config /></PasswordProtection>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

