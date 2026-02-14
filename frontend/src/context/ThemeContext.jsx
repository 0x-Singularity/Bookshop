import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Check localStorage for saved theme, default to 'day'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bookshop-theme')
    return saved || 'day'
  })

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('bookshop-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'day' ? 'night' : 'day')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
