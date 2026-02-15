import json
from datetime import date

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_get_all_books_empty(client):
    """Test getting books when database is empty"""
    response = client.get('/api/books')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == []

def test_create_book(client):
    """Test creating a new book"""
    book_data = {
        'title': 'The Great Gatsby',
        'author': 'F. Scott Fitzgerald',
        'total_pages': 180,
        'current_page': 0
    }
    response = client.post('/api/books', 
                          data=json.dumps(book_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['title'] == 'The Great Gatsby'
    assert data['author'] == 'F. Scott Fitzgerald'
    assert data['status'] == 'not-started'

def test_create_book_missing_fields(client):
    """Test creating a book with missing required fields"""
    book_data = {
        'title': 'Incomplete Book'
        # Missing author and total_pages
    }
    response = client.post('/api/books',
                          data=json.dumps(book_data),
                          content_type='application/json')
    
    assert response.status_code == 400

def test_get_book_by_id(client, sample_book):
    """Test getting a specific book"""
    book_id = sample_book.id
    response = client.get(f'/api/books/{book_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['id'] == book_id
    assert data['title'] == sample_book.title

def test_get_nonexistent_book(client):
    """Test getting a book that doesn't exist"""
    response = client.get('/api/books/999')
    assert response.status_code == 404

def test_update_book(client, sample_book):
    """Test updating a book"""
    book_id = sample_book.id
    update_data = {
        'current_page': 100
    }
    response = client.put(f'/api/books/{book_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['current_page'] == 100
    assert data['status'] == 'reading'  # Should auto-update status

def test_update_book_to_completed(client, sample_book):
    """Test updating a book to completed"""
    book_id = sample_book.id
    total_pages = sample_book.total_pages
    update_data = {
        'current_page': total_pages
    }
    response = client.put(f'/api/books/{book_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'completed'
    assert data['date_completed'] is not None

def test_delete_book(client, sample_book):
    """Test deleting a book"""
    book_id = sample_book.id
    response = client.delete(f'/api/books/{book_id}')
    assert response.status_code == 200
    
    # Verify it's deleted
    response = client.get(f'/api/books/{book_id}')
    assert response.status_code == 404

def test_create_reading_session(client, sample_book):
    """Test creating a reading session"""
    book_id = sample_book.id
    session_data = {
        'book_id': book_id,
        'pages_read': 25,
        'duration_minutes': 30,
        'notes': 'Great reading session'
    }
    response = client.post('/api/sessions',
                          data=json.dumps(session_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['pages_read'] == 25
    assert data['duration_minutes'] == 30

def test_create_session_updates_book(client, sample_book):
    """Test that creating a session updates the book's current page"""
    book_id = sample_book.id
    initial_page = sample_book.current_page
    
    session_data = {
        'book_id': book_id,
        'pages_read': 50,
        'duration_minutes': 60
    }
    client.post('/api/sessions',
               data=json.dumps(session_data),
               content_type='application/json')
    
    # Check book was updated
    response = client.get(f'/api/books/{book_id}')
    data = json.loads(response.data)
    assert data['current_page'] == initial_page + 50

def test_get_book_sessions(client, sample_book, sample_session):
    """Test getting all sessions for a book"""
    book_id = sample_book.id
    response = client.get(f'/api/books/{book_id}/sessions')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['book_id'] == book_id

def test_delete_session(client, sample_session):
    """Test deleting a reading session"""
    session_id = sample_session.id
    response = client.delete(f'/api/sessions/{session_id}')
    assert response.status_code == 200

def test_search_books_api(client):
    """Test Google Books search endpoint"""
    # This is a real API call, so we just test the endpoint exists
    # You might want to mock this in production
    response = client.get('/api/search/books?q=python')
    assert response.status_code in [200, 500]  # 500 if no internet

def test_create_session_missing_fields(client):
    """Test creating session with missing required fields"""
    session_data = {
        'book_id': 1
        # Missing pages_read and duration_minutes
    }
    response = client.post('/api/sessions',
                          data=json.dumps(session_data),
                          content_type='application/json')
    
    assert response.status_code == 400
