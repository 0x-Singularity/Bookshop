import { useState } from 'react'
import { createSession } from '../services/api'

function SessionForm({ bookId, currentPage, totalPages, onSessionCreated, onCancel }) {
  const [formData, setFormData] = useState({
    session_date: new Date().toISOString().split('T')[0], // Today's date
    pages_read: '',
    duration_minutes: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const pagesRead = parseInt(formData.pages_read)
    const durationMinutes = parseInt(formData.duration_minutes)

    // Validation
    if (isNaN(pagesRead) || pagesRead <= 0) {
      alert('Please enter a valid number of pages read')
      return
    }

    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      alert('Please enter a valid duration in minutes')
      return
    }

    const pagesRemaining = totalPages - currentPage
    if (pagesRead > pagesRemaining) {
      alert(`You can only read up to ${pagesRemaining} more pages for this book`)
      return
    }

    try {
      setSaving(true)
      const sessionData = {
        book_id: bookId,
        session_date: formData.session_date,
        pages_read: pagesRead,
        duration_minutes: durationMinutes,
        notes: formData.notes || null
      }

      const newSession = await createSession(sessionData)
      onSessionCreated(newSession)
      
      // Reset form
      setFormData({
        session_date: new Date().toISOString().split('T')[0],
        pages_read: '',
        duration_minutes: '',
        notes: ''
      })
    } catch (err) {
      console.error('Error creating session:', err)
      alert('Failed to log session. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-cream-50">
      <h3 className="font-serif font-bold text-lg text-brown-900 mb-4">
        Log Reading Session
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              Date
            </label>
            <input
              type="date"
              name="session_date"
              value={formData.session_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              Pages Read *
            </label>
            <input
              type="number"
              name="pages_read"
              value={formData.pages_read}
              onChange={handleChange}
              min="1"
              max={totalPages - currentPage}
              required
              placeholder="25"
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            min="1"
            required
            placeholder="30"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Thoughts about this reading session..."
            className="textarea"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? 'Saving...' : 'Log Session'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default SessionForm
