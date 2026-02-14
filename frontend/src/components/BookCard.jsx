import { Link } from 'react-router-dom'
import { deleteBook } from '../services/api'
import { useState } from 'react'

function BookCard({ book, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault() // Prevent navigation when clicking delete
    
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteBook(book.id)
      onDelete(book.id)
    } catch (err) {
      console.error('Error deleting book:', err)
      alert('Failed to delete book. Please try again.')
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading':
        return 'bg-sage-500 text-white'
      case 'completed':
        return 'bg-terracotta-500 text-white'
      case 'not-started':
        return 'bg-cream-400 text-brown-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'reading':
        return 'Reading'
      case 'completed':
        return 'Completed'
      case 'not-started':
        return 'Want to Read'
      default:
        return status
    }
  }

  return (
    <div className="block group h-full">
      <div className="card hover:scale-105 transition-transform duration-200 h-full flex flex-col">
        {/* Book Cover */}
        <Link to={`/book/${book.id}`} className="block relative mb-4">
          {book.cover_url ? (
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 rounded-lg shadow-md flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--accent), var(--accent-hover))' }}>
              <div className="text-center text-white p-4">
                <div className="font-bold text-lg line-clamp-3" style={{ fontFamily: 'DM Serif Display, serif' }}>{book.title}</div>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
            {getStatusLabel(book.status)}
          </span>
        </Link>

        {/* Book Info */}
        <div className="flex-1 flex flex-col">
          <Link to={`/book/${book.id}`}>
            <h3 className="font-serif font-bold text-lg text-brown-900 mb-1 group-hover:text-terracotta-600 transition-colors line-clamp-2">
              {book.title}
            </h3>
            <p className="text-brown-700 text-sm mb-3">
              by {book.author}
            </p>
          </Link>

          {/* Progress Bar */}
          {book.status !== 'not-started' && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-brown-700 mb-1">
                <span>{book.current_page} / {book.total_pages} pages</span>
                <span className="font-semibold">{book.progress_percentage}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${book.progress_percentage}%` }}
                />
              </div>
            </div>
          )}

          {book.status === 'not-started' && (
            <div className="mb-3 text-sm text-brown-700">
              {book.total_pages} pages
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-auto text-xs text-red-600 hover:text-red-800 transition-colors text-left disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard
