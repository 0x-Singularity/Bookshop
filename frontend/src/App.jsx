import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import BookDetailPage from './pages/BookDetailPage'
import AddBookPage from './pages/AddBookPage'
import ThemeToggle from './components/ThemeToggle'

function Navigation() {
  const location = useLocation()
  
  return (
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
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/add" element={<AddBookPage />} />
        </Routes>
      </main>

      {/* Cozy Footer */}
      <footer style={{ 
        backgroundColor: 'var(--bg-surface)',
        borderTop: `1px solid var(--border)`
      }} className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p style={{ color: 'var(--text-muted)' }} className="mb-2">
              Built with love for book lovers
            </p>
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
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
