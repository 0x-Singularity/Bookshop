import pytest
from app import app as flask_app
from models import db, User, Book, ReadingSession
import tempfile
import os

@pytest.fixture
def app():
    """Create and configure a test app instance"""
    # Create a temporary database file
    db_fd, db_path = tempfile.mkstemp()
    
    flask_app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'WTF_CSRF_ENABLED': False
    })
    
    # Create the database and tables
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()
    
    # Clean up temp file
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create a test CLI runner"""
    return app.test_cli_runner()

@pytest.fixture
def test_user(app):
    """Create a test user"""
    with app.app_context():
        user = User(
            username='testuser',
            email='test@example.com'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        # Store user ID
        user_id = user.id
        
        # Refresh to get full object
        db.session.refresh(user)
        
        yield user
        
        # Clean up
        user = db.session.get(User, user_id)
        if user:
            db.session.delete(user)
            db.session.commit()

@pytest.fixture
def authenticated_client(client, test_user):
    """Create an authenticated client"""
    client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    return client

@pytest.fixture
def sample_book(app, test_user):
    """Create a sample book for testing"""
    with app.app_context():
        user = db.session.get(User, test_user.id)
        
        book = Book(
            user_id=user.id,
            title="Test Book",
            author="Test Author",
            total_pages=300,
            current_page=0,
            status='not-started'
        )
        db.session.add(book)
        db.session.commit()
        
        # Store the book ID
        book_id = book.id
        
        # Refresh to get the full object
        db.session.refresh(book)
        
        yield book
        
        # Clean up
        book = db.session.get(Book, book_id)
        if book:
            db.session.delete(book)
            db.session.commit()

@pytest.fixture
def sample_session(app, sample_book):
    """Create a sample reading session for testing"""
    with app.app_context():
        # Get a fresh copy of the book in this session
        book = db.session.get(Book, sample_book.id)
        
        session = ReadingSession(
            book_id=book.id,
            pages_read=50,
            duration_minutes=60,
            notes="Test session"
        )
        db.session.add(session)
        db.session.commit()
        
        # Store the session ID
        session_id = session.id
        
        # Refresh to get the full object
        db.session.refresh(session)
        
        yield session
        
        # Clean up
        session = db.session.get(ReadingSession, session_id)
        if session:
            db.session.delete(session)
            db.session.commit()
