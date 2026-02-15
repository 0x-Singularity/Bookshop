from models import db, User, Book, ReadingSession
from datetime import date

def test_user_creation(app):
    """Test creating a user"""
    with app.app_context():
        user = User(
            username='newuser',
            email='new@test.com'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        
        assert user.id is not None
        assert user.username == 'newuser'
        assert user.check_password('password123')
        assert not user.check_password('wrongpassword')

def test_book_creation(app, test_user):
    """Test creating a book"""
    with app.app_context():
        user = db.session.get(User, test_user.id)
        
        book = Book(
            user_id=user.id,
            title="The Hobbit",
            author="J.R.R. Tolkien",
            total_pages=310,
            current_page=0
        )
        db.session.add(book)
        db.session.commit()
        
        assert book.id is not None
        assert book.title == "The Hobbit"
        assert book.author == "J.R.R. Tolkien"
        assert book.status == 'not-started'
        assert book.user_id == user.id

def test_book_to_dict(app, sample_book):
    """Test book serialization"""
    with app.app_context():
        # Get a fresh copy of the book
        book = db.session.get(Book, sample_book.id)
        book_dict = book.to_dict()
        
        assert 'id' in book_dict
        assert 'user_id' in book_dict
        assert 'title' in book_dict
        assert 'author' in book_dict
        assert 'progress_percentage' in book_dict
        assert 'pages_remaining' in book_dict

def test_book_progress_calculation(app, test_user):
    """Test progress percentage calculation"""
    with app.app_context():
        user = db.session.get(User, test_user.id)
        
        book = Book(
            user_id=user.id,
            title="Test",
            author="Author",
            total_pages=100,
            current_page=50
        )
        db.session.add(book)
        db.session.commit()
        
        book_dict = book.to_dict()
        assert book_dict['progress_percentage'] == 50.0
        assert book_dict['pages_remaining'] == 50

def test_reading_session_creation(app, test_user, sample_book):
    """Test creating a reading session"""
    with app.app_context():
        book_id = sample_book.id
        session = ReadingSession(
            book_id=book_id,
            pages_read=25,
            duration_minutes=30,
            notes="Great chapter!"
        )
        db.session.add(session)
        db.session.commit()
        
        assert session.id is not None
        assert session.book_id == book_id
        assert session.pages_read == 25
        assert session.duration_minutes == 30

def test_session_to_dict(app, sample_session):
    """Test session serialization"""
    with app.app_context():
        # Get a fresh copy of the session
        session = db.session.get(ReadingSession, sample_session.id)
        session_dict = session.to_dict()
        
        assert 'id' in session_dict
        assert 'book_id' in session_dict
        assert 'pages_read' in session_dict
        assert 'duration_minutes' in session_dict
        assert 'session_date' in session_dict

def test_book_session_relationship(app, sample_book, sample_session):
    """Test relationship between books and sessions"""
    with app.app_context():
        book = db.session.get(Book, sample_book.id)
        assert len(book.sessions) >= 1
        assert book.sessions[0].pages_read == 50

def test_cascade_delete(app, sample_book, sample_session):
    """Test that deleting a book deletes its sessions"""
    with app.app_context():
        book_id = sample_book.id
        session_id = sample_session.id
        
        # Get fresh copies
        book = db.session.get(Book, book_id)
        db.session.delete(book)
        db.session.commit()
        
        # Check book is deleted
        assert db.session.get(Book, book_id) is None
        # Check session is also deleted (cascade)
        assert db.session.get(ReadingSession, session_id) is None

def test_user_cascade_delete(app, test_user, sample_book):
    """Test that deleting a user deletes their books"""
    with app.app_context():
        user_id = test_user.id
        book_id = sample_book.id
        
        # Get fresh copy
        user = db.session.get(User, user_id)
        db.session.delete(user)
        db.session.commit()
        
        # Check user is deleted
        assert db.session.get(User, user_id) is None
        # Check book is also deleted (cascade)
        assert db.session.get(Book, book_id) is None
