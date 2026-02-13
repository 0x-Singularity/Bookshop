import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchBooks, createBook } from '../services/api'

function AddBookPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [manualEntry, setManualEntry] = useState(false)
  const [saving, setSaving] = useState(false)

  // Manual entry form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    total_pages: '',
    cover_url: ''
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setSearching(true)
      const results = await searchBooks(searchQuery)
      setSearchResults(results)
    } catch (err) {
      console.error('Search error:', err)
      alert('Failed to search books. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      total_pages: book.page_count || '',
      cover_url: book.cover_url || ''
    })
  }

  const handleManualEntry = () => {
    setManualEntry(true)
    setSelectedBook(null)
    setSearchResults([])
    setFormData({
      title: '',
      author: '',
      total_pages: '',
      cover_url: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author || !formData.total_pages) {
      alert('Please fill in title, author, and total pages')
      return
    }

    try {
      setSaving(true)
      const bookData = {
        title: formData.title,
        author: formData.author,
        total_pages: parseInt(formData.total_pages),
        cover_url: formData.cover_url || null,
        thumbnail_url: formData.cover_url || null,
        google_books_id: selectedBook?.google_books_id || null,
        isbn: selectedBook?.isbn || null
      }

      const newBook = await createBook(bookData)
      navigate(`/book/${newBook.id}`)
    } catch (err) {
      console.error('Error creating book:', err)
      alert('Failed to add book. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brown-900 mb-8">
        Add a New Book
      </h2>

      {/* Search or Manual Entry Toggle */}
      {!selectedBook && !manualEntry && (
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <label className="block text-brown-900 font-medium mb-2">
              Search for a book
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter book title or author..."
                className="input flex-1"
              />
              <button 
                type="submit" 
                disabled={searching}
                className="btn-primary"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          <button
            onClick={handleManualEntry}
            className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium"
          >
            Or enter book details manually →
          </button>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-brown-900 mb-4">Search Results:</h3>
              <div className="space-y-3">
                {searchResults.map((book, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectBook(book)}
                    className="card cursor-pointer hover:bg-cream-50 transition-colors flex gap-4"
                  >
                    {book.cover_url && (
                      <img 
                        src={book.cover_url} 
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-brown-900">
                        {book.title}
                      </h4>
                      <p className="text-sm text-brown-700">by {book.author}</p>
                      <p className="text-xs text-brown-600 mt-1">
                        {book.page_count ? `${book.page_count} pages` : 'Page count unknown'}
                      </p>
                      {book.description && (
                        <p className="text-xs text-brown-600 mt-1 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Book Details Form */}
      {(selectedBook || manualEntry) && (
        <form onSubmit={handleSubmit} className="card">
          {!manualEntry && (
            <button
              type="button"
              onClick={() => {
                setSelectedBook(null)
                setSearchResults([])
              }}
              className="text-sm text-terracotta-600 hover:text-terracotta-700 mb-4"
            >
              ← Back to search
            </button>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-brown-900 font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-brown-900 font-medium mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-brown-900 font-medium mb-2">
                Total Pages *
              </label>
              <input
                type="number"
                name="total_pages"
                value={formData.total_pages}
                onChange={handleInputChange}
                required
                min="1"
                className="input"
              />
            </div>

            <div>
              <label className="block text-brown-900 font-medium mb-2">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                name="cover_url"
                value={formData.cover_url}
                onChange={handleInputChange}
                placeholder="https://..."
                className="input"
              />
              {formData.cover_url && (
                <img 
                  src={formData.cover_url} 
                  alt="Book cover preview"
                  className="mt-2 w-32 h-48 object-cover rounded"
                />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? 'Adding Book...' : 'Add to Library'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddBookPage
