import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks } from '../services/api'
import BookCard from '../components/BookCard'

function LandingPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await getAllBooks()
      setBooks(data)
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = (deletedBookId) => {
    setBooks(books.filter(book => book.id !== deletedBookId))
  }

  // Get a few books to showcase (reading and completed)
  const readingBooks = books.filter(book => book.status === 'reading').slice(0, 3)
  const completedBooks = books.filter(book => book.status === 'completed').slice(0, 3)
  const showcaseBooks = [...readingBooks, ...completedBooks].slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-terracotta-500 via-terracotta-400 to-sage-500 text-white py-20 px-4 rounded-2xl mb-16 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Welcome to Bookshop
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-cream-100 font-light">
            Your cozy corner for tracking reading journeys
          </p>
          <p className="text-lg mb-10 text-cream-100 max-w-2xl mx-auto">
            Keep track of the books you're reading, log your reading sessions, 
            and watch your literary adventures unfold with beautiful progress tracking.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/add" className="bg-white text-terracotta-600 hover:bg-cream-100 font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-md hover:shadow-xl">
              + Add Your First Book
            </Link>
            <Link to="/library" className="bg-brown-800 hover:bg-brown-900 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-md hover:shadow-xl">
              View My Library
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-serif font-bold text-brown-900 text-center mb-12">
          Everything You Need to Track Your Reading
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card text-center bg-gradient-to-b from-white to-cream-50">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-serif font-bold text-brown-900 mb-3">
              Smart Book Management
            </h3>
            <p className="text-brown-700">
              Search the Google Books API for instant book details and covers, 
              or add books manually. Organize by status and track your progress.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card text-center bg-gradient-to-b from-white to-cream-50">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-serif font-bold text-brown-900 mb-3">
              Reading Sessions
            </h3>
            <p className="text-brown-700">
              Log each reading session with pages read, time spent, and notes. 
              View your reading speed and total time invested.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card text-center bg-gradient-to-b from-white to-cream-50">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-serif font-bold text-brown-900 mb-3">
              Cozy Design
            </h3>
            <p className="text-brown-700">
              A warm, inviting interface designed to make tracking your reading 
              as enjoyable as reading itself.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Books Section */}
      {books.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brown-900 mb-2">
                Your Books
              </h2>
              <p className="text-brown-700">
                {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
              </p>
            </div>
            <Link to="/library" className="btn-primary">
              View All Books →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-terracotta-500 border-t-transparent"></div>
            </div>
          ) : showcaseBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12 bg-cream-50">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-brown-700 text-lg mb-4">
                Your library is empty
              </p>
              <Link to="/add" className="btn-primary inline-block">
                + Add Your First Book
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Call to Action Section */}
      {books.length === 0 && (
        <section className="card bg-gradient-to-br from-sage-400 to-sage-600 text-white text-center py-16">
          <div className="text-6xl mb-6">☕</div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-lg mb-8 text-cream-100 max-w-2xl mx-auto">
            Add your first book and begin tracking your reading progress today. 
            Whether it's a novel, biography, or technical book, Bookshop helps you stay motivated.
          </p>
          <Link to="/add" className="bg-white text-sage-700 hover:bg-cream-100 font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-md hover:shadow-xl inline-block">
            Get Started
          </Link>
        </section>
      )}

      {/* How It Works Section */}
      <section className="mt-16 bg-cream-50 rounded-2xl p-12">
        <h2 className="text-3xl font-serif font-bold text-brown-900 text-center mb-12">
          How It Works
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6 items-start">
            <div className="bg-terracotta-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-brown-900 mb-2">
                Add Books to Your Library
              </h3>
              <p className="text-brown-700">
                Search for books using the Google Books API to automatically import covers and details, 
                or add books manually with your own information.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6 items-start">
            <div className="bg-terracotta-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-brown-900 mb-2">
                Track Your Reading Progress
              </h3>
              <p className="text-brown-700">
                Update your current page as you read and watch the progress bar fill up. 
                Your book status automatically updates from "Want to Read" to "Reading" to "Completed".
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 items-start">
            <div className="bg-terracotta-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-brown-900 mb-2">
                Log Reading Sessions
              </h3>
              <p className="text-brown-700">
                Record each reading session with the pages read, time spent, and optional notes. 
                View statistics like your reading speed and total time invested in each book.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
