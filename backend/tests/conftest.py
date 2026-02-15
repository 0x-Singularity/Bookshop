import pytest
from app import app as flask_app
from models import db, Book, ReadingSession
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
        'SQLALCHEMY_TRACK_MODIFICATIONS': False
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
def sample_book(app):
    """Create a sample book for testing"""
    with app.app_context():
        book = Book(
            title="Test Book",
            author="Test Author",
            total_pages=300,
            current_page=0,
            status='not-started'
        )
        db.session.add(book)
        db.session.commit()
        
        # Store the book ID before session expires
        book_id = book.id
        
        # Refresh to get the full object
        db.session.refresh(book)
        
        yield book
        
        # Clean up - delete the book if it still exists
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
