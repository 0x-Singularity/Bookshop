from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import Config
from models import db, User, Book, ReadingSession
from datetime import datetime, date
import requests

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS with credentials support
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])

# Initialize database
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create tables if they don't exist
with app.app_context():
    db.create_all()


# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Username, email, and password are required'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Log the user in
    login_user(user)
    
    return jsonify({
        'message': 'User created successfully',
        'user': user.to_dict()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Log in a user"""
    data = request.get_json()
    
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400
    
    # Find user
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Log the user in
    login_user(user, remember=True)
    
    return jsonify({
        'message': 'Logged in successfully',
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    """Log out the current user"""
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """Get the current logged-in user"""
    return jsonify({'user': current_user.to_dict()}), 200


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
@login_required
def get_books():
    """Get all books for the current user"""
    books = Book.query.filter_by(user_id=current_user.id).order_by(Book.created_at.desc()).all()
    return jsonify([book.to_dict() for book in books]), 200


@app.route('/api/books/<int:book_id>', methods=['GET'])
@login_required
def get_book(book_id):
    """Get a single book by ID"""
    book = Book.query.filter_by(id=book_id, user_id=current_user.id).first_or_404()
    return jsonify(book.to_dict()), 200


@app.route('/api/books', methods=['POST'])
@login_required
def create_book():
    """Create a new book"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title') or not data.get('author') or not data.get('total_pages'):
        return jsonify({'error': 'Title, author, and total_pages are required'}), 400
    
    new_book = Book(
        user_id=current_user.id,
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
@login_required
def update_book(book_id):
    """Update a book"""
    book = Book.query.filter_by(id=book_id, user_id=current_user.id).first_or_404()
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
@login_required
def delete_book(book_id):
    """Delete a book and all its sessions"""
    book = Book.query.filter_by(id=book_id, user_id=current_user.id).first_or_404()
    db.session.delete(book)
    db.session.commit()
    
    return jsonify({'message': 'Book deleted successfully'}), 200


# ==================== READING SESSION ROUTES ====================

@app.route('/api/books/<int:book_id>/sessions', methods=['GET'])
@login_required
def get_book_sessions(book_id):
    """Get all reading sessions for a book"""
    book = Book.query.filter_by(id=book_id, user_id=current_user.id).first_or_404()
    sessions = ReadingSession.query.filter_by(book_id=book_id).order_by(ReadingSession.session_date.desc()).all()
    return jsonify([session.to_dict() for session in sessions]), 200


@app.route('/api/sessions', methods=['POST'])
@login_required
def create_session():
    """Create a new reading session"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('book_id') or not data.get('pages_read') or not data.get('duration_minutes'):
        return jsonify({'error': 'book_id, pages_read, and duration_minutes are required'}), 400
    
    # Verify the book belongs to the current user
    book = Book.query.filter_by(id=data['book_id'], user_id=current_user.id).first_or_404()
    
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
@login_required
def delete_session(session_id):
    """Delete a reading session"""
    session = ReadingSession.query.get_or_404(session_id)
    
    # Verify the session's book belongs to the current user
    book = Book.query.filter_by(id=session.book_id, user_id=current_user.id).first_or_404()
    
    # Update the book's current page (subtract the pages from this session)
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
