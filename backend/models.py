from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Book(db.Model):
    """Model for books being tracked"""
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    total_pages = db.Column(db.Integer, nullable=False)
    current_page = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='not-started')  # 'not-started', 'reading', 'completed'
    
    # Book metadata from API
    cover_url = db.Column(db.String(500), nullable=True)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    isbn = db.Column(db.String(20), nullable=True)
    google_books_id = db.Column(db.String(100), nullable=True)
    
    # Dates
    date_started = db.Column(db.Date, nullable=True)
    date_completed = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to reading sessions
    sessions = db.relationship('ReadingSession', backref='book', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert book object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'total_pages': self.total_pages,
            'current_page': self.current_page,
            'status': self.status,
            'cover_url': self.cover_url,
            'thumbnail_url': self.thumbnail_url,
            'isbn': self.isbn,
            'google_books_id': self.google_books_id,
            'date_started': self.date_started.isoformat() if self.date_started else None,
            'date_completed': self.date_completed.isoformat() if self.date_completed else None,
            'created_at': self.created_at.isoformat(),
            'progress_percentage': round((self.current_page / self.total_pages * 100), 1) if self.total_pages > 0 else 0,
            'pages_remaining': self.total_pages - self.current_page
        }


class ReadingSession(db.Model):
    """Model for individual reading sessions"""
    __tablename__ = 'reading_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    session_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    pages_read = db.Column(db.Integer, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert session object to dictionary"""
        return {
            'id': self.id,
            'book_id': self.book_id,
            'session_date': self.session_date.isoformat(),
            'pages_read': self.pages_read,
            'duration_minutes': self.duration_minutes,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
