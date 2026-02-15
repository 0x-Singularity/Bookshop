import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import BookDetailPage from './pages/BookDetailPage'
import AddBookPage from './pages/AddBookPage'
import ThemeToggle from './components/ThemeToggle'
import UserMenu from './components/UserMenu'
import AuthModal from './components/AuthModal'

function Navigation() {
  const location = useLocation()
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  return (
    <>
      <nav style={{ 
        backgroundColor: 'var(--bg-surface)',
        borderBottom: `1px solid var(--border)`,
        boxShadow: '0 1px 3px var(--shadow)'
      }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img src="/book.png" alt="Bookshop" className="w-8 h-8" />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                Bookshop
              </h1>
            </Link>
            
            <div className="flex space-x-4 items-center">
              {user && (
                <>
                  <Link 
                    to="/library" 
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: location.pathname === '/library' ? 'var(--bg-surface-alt)' : 'transparent',
                      color: location.pathname === '/library' ? 'var(--accent)' : 'var(--text-muted)'
                    }}
                  >
                    My Library
                  </Link>
                  <Link 
                    to="/add" 
                    className="btn-primary text-sm"
                  >
                    + Add Book
                  </Link>
                </>
              )}
              <ThemeToggle />
              {!loading && <UserMenu onOpenAuth={() => setShowAuthModal(true)} />}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/library" element={user ? <LibraryPage /> : <LandingPage />} />
          <Route path="/book/:id" element={user ? <BookDetailPage /> : <LandingPage />} />
          <Route path="/add" element={user ? <AddBookPage /> : <LandingPage />} />
        </Routes>
      </main>

      {/* Cozy Footer */}
      <footer style={{ 
        backgroundColor: 'var(--bg-surface)',
        borderTop: `1px solid var(--border)`
      }} className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Happy reading!
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
