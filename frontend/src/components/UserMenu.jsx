import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function UserMenu({ onOpenAuth }) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Icon Button */}
      <button
        onClick={() => user ? setIsOpen(!isOpen) : onOpenAuth()}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80"
        style={{ 
          backgroundColor: user ? 'var(--accent)' : 'var(--bg-surface-alt)',
          border: `2px solid ${user ? 'var(--accent)' : 'var(--border)'}`
        }}
        aria-label={user ? 'User menu' : 'Sign in'}
      >
        {user ? (
          // Logged in - show first letter of username
          <span className="font-bold text-white text-lg" style={{ fontFamily: 'Space Mono, monospace' }}>
            {user.username[0].toUpperCase()}
          </span>
        ) : (
          // Not logged in - show user icon
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: 'var(--text-muted)' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        )}
      </button>

      {/* Dropdown Menu (only when logged in) */}
      {user && isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-50"
          style={{ 
            backgroundColor: 'var(--bg-surface)',
            border: `1px solid var(--border)`
          }}
        >
          {/* User info */}
          <div className="px-4 py-3" style={{ borderBottom: `1px solid var(--border)` }}>
            <p className="font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Mono, monospace' }}>
              {user.username}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Signed in
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ 
                color: 'var(--text-primary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-surface-alt)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
