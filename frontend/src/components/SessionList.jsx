import { deleteSession } from '../services/api'
import { useState } from 'react'

function SessionList({ sessions, onSessionDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return
    }

    try {
      setDeletingId(sessionId)
      await deleteSession(sessionId)
      onSessionDeleted(sessionId)
    } catch (err) {
      console.error('Error deleting session:', err)
      alert('Failed to delete session. Please try again.')
      setDeletingId(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (sessions.length === 0) {
    return (
      <div className="card text-center py-12 bg-cream-50">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-brown-700 text-lg mb-2">No reading sessions yet</p>
        <p className="text-brown-600 text-sm">
          Start logging your reading sessions to track your progress!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div key={session.id} className="card hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-brown-700">
                  {formatDate(session.session_date)}
                </span>
                <span className="text-xs bg-terracotta-100 text-terracotta-700 px-2 py-1 rounded-full">
                  {session.pages_read} pages
                </span>
                <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
                  {formatDuration(session.duration_minutes)}
                </span>
              </div>
              
              {session.notes && (
                <p className="text-sm text-brown-700 bg-cream-50 p-3 rounded-lg italic">
                  "{session.notes}"
                </p>
              )}
            </div>

            <button
              onClick={() => handleDelete(session.id)}
              disabled={deletingId === session.id}
              className="text-xs text-red-600 hover:text-red-800 transition-colors ml-4 disabled:opacity-50"
            >
              {deletingId === session.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {/* Reading Speed */}
          <div className="text-xs text-brown-600 mt-2">
            {Math.round(session.pages_read / (session.duration_minutes / 60))} pages/hour
          </div>
        </div>
      ))}
    </div>
  )
}

export default SessionList
