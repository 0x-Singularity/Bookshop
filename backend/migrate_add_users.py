"""
Database migration script to add user authentication

IMPORTANT: This will DELETE all existing books and sessions since we're adding
a user_id foreign key requirement. 

If you have existing data you want to keep, you'll need to:
1. Export your current books
2. Run this migration
3. Create a user account
4. Re-import your books with the user_id

For a fresh start, just run this script.
"""

import os
import sys

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, Book, ReadingSession

def migrate():
    """Run the migration"""
    with app.app_context():
        print("Starting migration...")
        
        # Drop all tables
        print("Dropping all existing tables...")
        db.drop_all()
        
        # Create all tables with new schema
        print("Creating tables with new schema...")
        db.create_all()
        
        print("Migration complete!")
        print("\nNext steps:")
        print("1. Start your Flask server: python app.py")
        print("2. Register a new user account via the frontend")
        print("3. Start adding books!")

if __name__ == '__main__':
    migrate()
