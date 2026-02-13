import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookDetailPage from './pages/BookDetailPage'
import AddBookPage from './pages/AddBookPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-100">
        {/* Cozy Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-cream-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">📚</span>
                <h1 className="text-2xl font-serif font-bold text-terracotta-600">
                  Bookshop
                </h1>
              </Link>
              
              <div className="flex space-x-4">
                <Link 
                  to="/" 
                  className="text-brown-700 hover:text-terracotta-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/add" element={<AddBookPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
