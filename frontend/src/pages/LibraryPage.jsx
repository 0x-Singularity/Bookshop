import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks } from '../services/api'
import BookCard from '../components/BookCard'

function LibraryPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, reading, completed, not-started
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await getAllBooks()
      setBooks(data)
      setError(null)
    } catch (err) {
      setError('Failed to load books. Make sure the backend is running!')
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true
    return book.status === filter
  })

  const handleDeleteBook = (deletedBookId) => {
    setBooks(books.filter(book => book.id !== deletedBookId))
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-terracotta-500 border-t-transparent"></div>
        <p className="mt-4 text-brown-700">Loading your library...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchBooks} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-brown-900 mb-2">
          My Reading Library
        </h2>
        <p className="text-brown-700">
          {books.length === 0 
            ? "Your cozy library is empty. Add your first book!" 
            : `${books.length} ${books.length === 1 ? 'book' : 'books'} in your collection`
          }
        </p>
      </div>

      {/* Filter Tabs */}
      {books.length > 0 && (
        <div className="flex space-x-2 mb-8 border-b border-cream-300 pb-2 overflow-x-auto">
          {[
            { value: 'all', label: 'All Books', count: books.length },
            { value: 'reading', label: 'Currently Reading', count: books.filter(b => b.status === 'reading').length },
            { value: 'completed', label: 'Completed', count: books.filter(b => b.status === 'completed').length },
            { value: 'not-started', label: 'Want to Read', count: books.filter(b => b.status === 'not-started').length }
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                filter === value
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-cream-200 text-brown-700 hover:bg-cream-300'
              }`}
            >
              {label} {count > 0 && <span className="opacity-75">({count})</span>}
            </button>
          ))}
        </div>
      )}

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>
            {filter === 'all' 
              ? "No books yet. Start building your library!" 
              : `No books in "${filter === 'not-started' ? 'Want to Read' : filter}" status.`
            }
          </p>
          <Link to="/add" className="btn-primary">
            + Add Your First Book
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-gradient-to-br from-terracotta-50 to-terracotta-100 text-center">
              <div className="text-3xl font-bold text-terracotta-600">
                {books.filter(b => b.status === 'reading').length}
              </div>
              <div className="text-sm text-brown-700 mt-1">Reading</div>
            </div>
            <div className="card bg-gradient-to-br from-sage-50 to-sage-100 text-center">
              <div className="text-3xl font-bold text-sage-600">
                {books.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-brown-700 mt-1">Completed</div>
            </div>
            <div className="card bg-gradient-to-br from-cream-200 to-cream-300 text-center">
              <div className="text-3xl font-bold text-brown-700">
                {books.filter(b => b.status === 'not-started').length}
              </div>
              <div className="text-sm text-brown-700 mt-1">Want to Read</div>
            </div>
            <div className="card bg-gradient-to-br from-brown-100 to-brown-200 text-center">
              <div className="text-3xl font-bold text-brown-800">
                {books.reduce((sum, book) => sum + book.current_page, 0)}
              </div>
              <div className="text-sm text-brown-700 mt-1">Pages Read</div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LibraryPage
