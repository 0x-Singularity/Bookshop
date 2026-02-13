from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Book, ReadingSession
from datetime import datetime, date
import requests

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend communication
CORS(app)

# Initialize database
db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()


# ==================== BOOK SEARCH ROUTES ====================

@app.route('/api/search/books', methods=['GET'])
def search_books():
    """Search for books using Google Books API"""
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'error': 'Query parameter required'}), 400
    
    try:
        url = f'https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=10'
        response = requests.get(url)
        data = response.json()
        
        if 'items' not in data:
            return jsonify([]), 200
        
        # Format the results for our frontend
        books = []
        for item in data['items']:
            volume_info = item.get('volumeInfo', {})
            
            # Get ISBN if available
            isbn = None
            identifiers = volume_info.get('industryIdentifiers', [])
            if identifiers:
                isbn = identifiers[0].get('identifier')
            
            # Get cover images
            image_links = volume_info.get('imageLinks', {})
            
            book = {
                'google_books_id': item.get('id'),
                'title': volume_info.get('title', 'Unknown Title'),
                'author': volume_info.get('authors', ['Unknown Author'])[0],
                'page_count': volume_info.get('pageCount', 0),
                'cover_url': image_links.get('thumbnail', '').replace('http://', 'https://'),
                'isbn': isbn,
                'description': volume_info.get('description', '')[:200] + '...' if volume_info.get('description') else ''
            }
            books.append(book)
        
        return jsonify(books), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== BOOK ROUTES ====================

@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books"""
    books = Book.query.order_by(Book.created_at.desc()).all()
    return jsonify([book.to_dict() for book in books]), 200


@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a single book by ID"""
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict()), 200


@app.route('/api/books', methods=['POST'])
def create_book():
    """Create a new book"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title') or not data.get('author') or not data.get('total_pages'):
        return jsonify({'error': 'Title, author, and total_pages are required'}), 400
    
    new_book = Book(
        title=data['title'],
        author=data['author'],
        total_pages=data['total_pages'],
        current_page=data.get('current_page', 0),
        status=data.get('status', 'not-started'),
        cover_url=data.get('cover_url'),
        thumbnail_url=data.get('thumbnail_url'),
        isbn=data.get('isbn'),
        google_books_id=data.get('google_books_id')
    )
    
    db.session.add(new_book)
    db.session.commit()
    
    return jsonify(new_book.to_dict()), 201


@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Update a book"""
    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    
    # Update fields if provided
    if 'title' in data:
        book.title = data['title']
    if 'author' in data:
        book.author = data['author']
    if 'total_pages' in data:
        book.total_pages = data['total_pages']
    if 'current_page' in data:
        book.current_page = data['current_page']
        
        # Auto-update status based on progress
        if book.current_page == 0:
            book.status = 'not-started'
        elif book.current_page >= book.total_pages:
            book.status = 'completed'
            if not book.date_completed:
                book.date_completed = date.today()
        else:
            book.status = 'reading'
            if not book.date_started:
                book.date_started = date.today()
    
    if 'status' in data:
        book.status = data['status']
    
    db.session.commit()
    
    return jsonify(book.to_dict()), 200


@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book and all its sessions"""
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    
    return jsonify({'message': 'Book deleted successfully'}), 200


# ==================== READING SESSION ROUTES ====================

@app.route('/api/books/<int:book_id>/sessions', methods=['GET'])
def get_book_sessions(book_id):
    """Get all reading sessions for a book"""
    book = Book.query.get_or_404(book_id)
    sessions = ReadingSession.query.filter_by(book_id=book_id).order_by(ReadingSession.session_date.desc()).all()
    return jsonify([session.to_dict() for session in sessions]), 200


@app.route('/api/sessions', methods=['POST'])
def create_session():
    """Create a new reading session"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('book_id') or not data.get('pages_read') or not data.get('duration_minutes'):
        return jsonify({'error': 'book_id, pages_read, and duration_minutes are required'}), 400
    
    book = Book.query.get_or_404(data['book_id'])
    
    # Create the session
    new_session = ReadingSession(
        book_id=data['book_id'],
        session_date=datetime.fromisoformat(data['session_date']) if data.get('session_date') else date.today(),
        pages_read=data['pages_read'],
        duration_minutes=data['duration_minutes'],
        notes=data.get('notes')
    )
    
    # Update the book's current page
    book.current_page += data['pages_read']
    
    # Don't exceed total pages
    if book.current_page > book.total_pages:
        book.current_page = book.total_pages
    
    # Update book status
    if book.current_page >= book.total_pages:
        book.status = 'completed'
        if not book.date_completed:
            book.date_completed = date.today()
    elif book.current_page > 0:
        book.status = 'reading'
        if not book.date_started:
            book.date_started = date.today()
    
    db.session.add(new_session)
    db.session.commit()
    
    return jsonify(new_session.to_dict()), 201


@app.route('/api/sessions/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a reading session"""
    session = ReadingSession.query.get_or_404(session_id)
    
    # Update the book's current page (subtract the pages from this session)
    book = Book.query.get(session.book_id)
    book.current_page -= session.pages_read
    if book.current_page < 0:
        book.current_page = 0
    
    db.session.delete(session)
    db.session.commit()
    
    return jsonify({'message': 'Session deleted successfully'}), 200


# ==================== UTILITY ROUTES ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Cozy Reading Tracker API is running'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
