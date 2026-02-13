import os

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///reading_tracker.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Google Books API (no key required for basic usage, but you can add one for higher limits)
    GOOGLE_BOOKS_API_KEY = os.environ.get('GOOGLE_BOOKS_API_KEY') or None
