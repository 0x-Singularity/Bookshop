import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        // Validation
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        if (username.length < 3) {
          setError('Username must be at least 3 characters')
          setLoading(false)
          return
        }

        await register(username, password)
      } else {
        await login(username, password)
      }

      // Success - close modal
      onClose()
      setUsername('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="card max-w-md w-full relative"
          style={{ backgroundColor: 'var(--bg-surface)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl leading-none transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            ×
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)', fontFamily: 'DM Serif Display, serif' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#fee', color: '#c00' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input"
                placeholder="Enter username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="Enter password"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="Confirm password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthModal
