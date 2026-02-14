import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import BookDetailPage from './pages/BookDetailPage'
import AddBookPage from './pages/AddBookPage'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="bg-white shadow-sm border-b border-cream-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl font-serif font-bold text-terracotta-600">
              Bookshop
            </h1>
          </Link>
          
          <div className="flex space-x-4 items-center">
            <Link 
              to="/library" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/library'
                  ? 'bg-terracotta-100 text-terracotta-700'
                  : 'text-brown-700 hover:text-terracotta-600'
              }`}
            >
              My Library
            </Link>
            <Link 
              to="/add" 
              className="btn-primary text-sm"
            >
              + Add Book
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-100 flex flex-col">
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
        <footer className="bg-white border-t border-cream-300 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-brown-700 mb-2">
                Built with ❤️ for book lovers
              </p>
              <p className="text-sm text-brown-600">
                Happy reading! ☕📖
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
