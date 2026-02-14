import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook, getBookSessions, updateBook, createSession, deleteSession } from '../services/api'
import SessionForm from '../components/SessionForm'
import SessionList from '../components/SessionList'

function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [updatingPage, setUpdatingPage] = useState(false)
  const [newPage, setNewPage] = useState('')

  useEffect(() => {
    fetchBookData()
  }, [id])

  const fetchBookData = async () => {
    try {
      setLoading(true)
      const [bookData, sessionsData] = await Promise.all([
        getBook(id),
        getBookSessions(id)
      ])
      setBook(bookData)
      setSessions(sessionsData)
      setNewPage(bookData.current_page)
    } catch (err) {
      console.error('Error fetching book data:', err)
      alert('Failed to load book. Redirecting to home...')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePage = async (e) => {
    e.preventDefault()
    
    const pageNum = parseInt(newPage)
    if (isNaN(pageNum) || pageNum < 0 || pageNum > book.total_pages) {
      alert(`Page must be between 0 and ${book.total_pages}`)
      return
    }

    try {
      setUpdatingPage(true)
      const updatedBook = await updateBook(id, { current_page: pageNum })
      setBook(updatedBook)
    } catch (err) {
      console.error('Error updating page:', err)
      alert('Failed to update page. Please try again.')
    } finally {
      setUpdatingPage(false)
    }
  }

  const handleSessionCreated = async (newSession) => {
    setSessions([newSession, ...sessions])
    setShowSessionForm(false)
    // Refresh book data to get updated current_page
    const updatedBook = await getBook(id)
    setBook(updatedBook)
    setNewPage(updatedBook.current_page)
  }

  const handleSessionDeleted = async (sessionId) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
    // Refresh book data to get updated current_page
    const updatedBook = await getBook(id)
    setBook(updatedBook)
    setNewPage(updatedBook.current_page)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-terracotta-500 border-t-transparent"></div>
        <p className="mt-4 text-brown-700">Loading book...</p>
      </div>
    )
  }

  if (!book) return null

  const totalPagesRead = sessions.reduce((sum, session) => sum + session.pages_read, 0)
  const totalTimeMinutes = sessions.reduce((sum, session) => sum + session.duration_minutes, 0)
  const avgPagesPerSession = sessions.length > 0 ? Math.round(totalPagesRead / sessions.length) : 0

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/library')}
        className="text-terracotta-600 hover:text-terracotta-700 mb-6 inline-flex items-center"
      >
        ← Back to Library
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Book Info */}
        <div className="md:col-span-1">
          <div className="card sticky top-8">
            {/* Cover */}
            {book.cover_url ? (
              <img 
                src={book.cover_url} 
                alt={book.title}
                className="w-full rounded-lg shadow-lg mb-4"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-lg shadow-lg mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--accent), var(--accent-hover))' }}>
                <div className="text-center text-white p-4">
                  <div className="text-2xl font-bold" style={{ fontFamily: 'DM Serif Display, serif' }}>
                    {book.title}
                  </div>
                </div>
              </div>
            )}

            <h1 className="font-serif font-bold text-2xl text-brown-900 mb-2">
              {book.title}
            </h1>
            <p className="text-brown-700 mb-4">by {book.author}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-brown-700 mb-2">
                <span>{book.current_page} / {book.total_pages} pages</span>
                <span className="font-bold">{book.progress_percentage}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${book.progress_percentage}%` }}
                />
              </div>
              {book.pages_remaining > 0 && (
                <p className="text-xs text-brown-600 mt-2">
                  {book.pages_remaining} pages remaining
                </p>
              )}
            </div>

            {/* Quick Update Page */}
            <form onSubmit={handleUpdatePage} className="mb-4">
              <label className="block text-sm font-medium text-brown-900 mb-2">
                Update Current Page
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newPage}
                  onChange={(e) => setNewPage(e.target.value)}
                  min="0"
                  max={book.total_pages}
                  className="input flex-1"
                />
                <button 
                  type="submit" 
                  disabled={updatingPage}
                  className="btn-secondary whitespace-nowrap"
                >
                  {updatingPage ? '...' : 'Update'}
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="bg-cream-100 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brown-700">Total Sessions:</span>
                <span className="font-medium text-brown-900">{sessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-700">Avg Pages/Session:</span>
                <span className="font-medium text-brown-900">{avgPagesPerSession}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-700">Total Time:</span>
                <span className="font-medium text-brown-900">
                  {Math.floor(totalTimeMinutes / 60)}h {totalTimeMinutes % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sessions */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-brown-900">
              Reading Sessions
            </h2>
            <button
              onClick={() => setShowSessionForm(!showSessionForm)}
              className="btn-primary"
            >
              {showSessionForm ? 'Cancel' : '+ Log Session'}
            </button>
          </div>

          {/* Session Form */}
          {showSessionForm && (
            <div className="mb-6">
              <SessionForm 
                bookId={book.id}
                currentPage={book.current_page}
                totalPages={book.total_pages}
                onSessionCreated={handleSessionCreated}
                onCancel={() => setShowSessionForm(false)}
              />
            </div>
          )}

          {/* Sessions List */}
          <SessionList 
            sessions={sessions}
            onSessionDeleted={handleSessionDeleted}
          />
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage
