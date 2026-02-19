# Bookshop - Personal Reading Tracker

A full-stack web application for tracking your reading journey. Built with React and Flask, Bookshop features user authentication, Google Books API integration, and day/night themes.

![Tests](https://github.com/0x-singularity/Bookshop/actions/workflows/backend-tests.yml/badge.svg)

---

## Screenshots

### Landing Page
![Landing Page](/pictures/LandingPage.png)

### Library View
![Library View](/pictures/LibraryView.png)

### Book Detail
![Book Detail](/pictures/BookView.png)

### Day/Night Theme
![Dark Mode Preview](/pictures/DarkMode.png)

### User Signup 
![User Signup](/pictures/Usersignup.png)

---

## Key Features

**User Authentication**
- Secure account creation and login with password hashing
- Session-based authentication with Flask-Login
- Private book libraries per user

**Book Management**
- Google Books API integration for automatic metadata and cover images
- Manual book entry for titles not in the API
- Status tracking (Want to Read, Currently Reading, Completed)
- Real-time progress bars and statistics

**Reading Analytics**
- Log individual reading sessions with pages read, duration, and notes
- Track average pages per session, total reading time, and reading speed
- View complete reading history with chronological sessions

**User Experience**
- Lofi-inspired design with monospace fonts and subtle grain texture
- Day/night mode toggle with persistent theme preferences
- Responsive layout optimized for desktop, tablet, and mobile
- Real-time book filtering by status

---

## Technology Stack

### Frontend
- **React 18** - Component-based UI with hooks and Context API
- **React Router** - Client-side routing
- **Tailwind CSS 4** - Custom design system with CSS variables
- **Axios** - HTTP client with credential support

### Backend
- **Flask 3.0** - Lightweight Python web framework
- **Flask-Login** - Session-based user authentication
- **SQLAlchemy** - ORM for database operations
- **SQLite/PostgreSQL** - Database (SQLite for development, PostgreSQL for production)
- **Werkzeug** - Password hashing for security

### Development & Testing
- **Pytest** - Backend testing framework with 36 comprehensive tests
- **GitHub Actions** - Automated CI/CD pipeline running tests on every push
- **Vite** - Fast build tool and development server

---

## Project Structure

```
bookshop/
├── backend/
│   ├── app.py              # Flask application with API routes
│   ├── models.py           # SQLAlchemy models (User, Book, ReadingSession)
│   ├── config.py           # Application configuration
│   ├── tests/              # Pytest test suite
│   │   ├── test_api.py     # API endpoint tests
│   │   └── test_models.py  # Database model tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page-level components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   └── services/       # API service layer
│   └── package.json        # Node dependencies
│
└── .github/
    └── workflows/
        └── backend-tests.yml  # CI/CD configuration
```

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd bookshop
```

**2. Backend Setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python migrate_add_users.py  # Initialize database
python app.py
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

**4. Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Book Endpoints
- `GET /api/books` - Get all books for current user
- `POST /api/books` - Create new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Reading Session Endpoints
- `GET /api/books/:id/sessions` - Get sessions for a book
- `POST /api/sessions` - Create reading session
- `DELETE /api/sessions/:id` - Delete session

### External API
- `GET /api/search/books?q=query` - Search Google Books API

All book and session endpoints require authentication.

---

## Testing

**Run Backend Tests**
```bash
cd backend
source venv/bin/activate
pytest                    # Run all tests
pytest --cov=.           # With coverage report
pytest -v                # Verbose output
```

**Test Coverage**
- 23 comprehensive tests covering:
  - User authentication and authorization
  - Book CRUD operations
  - Reading session management
  - Database relationships and cascade deletes
  - Input validation and error handling

**Continuous Integration**
- GitHub Actions automatically runs all tests on every push to main branch
- Tests must pass before merging pull requests
- Coverage reports generated for each run

---

## Design System

**Color Themes**

*Day Theme:* Warm, cozy tones with cream backgrounds and terracotta accents

*Night Theme:* Deep blue-grey backgrounds with warm orange accents inspired by evening study sessions

**Typography**
- Headers: DM Serif Display (italic, elegant)
- Body: IBM Plex Mono (monospace for lofi aesthetic)
- Buttons: Space Mono (bold, retro)

**Visual Elements**
- Grain texture overlay for vintage atmosphere
- Custom scrollbar matching theme colors
- Smooth transitions between themes
- SVG icons for clean, scalable graphics

---

## Database Schema

**Users Table**
```
id, username (unique), email (unique), password_hash, created_at
```

**Books Table**
```
id, user_id (FK), title, author, total_pages, current_page, status,
cover_url, thumbnail_url, isbn, google_books_id,
date_started, date_completed, created_at
```

**Reading Sessions Table**
```
id, book_id (FK), session_date, pages_read, duration_minutes,
notes, created_at
```

**Relationships:**
- User → Books (one-to-many, cascade delete)
- Book → Sessions (one-to-many, cascade delete)

---

## Security Features

- Password hashing with Werkzeug's generate_password_hash
- Session-based authentication with Flask-Login
- HTTP-only cookies preventing XSS attacks
- CORS configured to allow only authorized origins
- User data isolation - users can only access their own books
- Input validation on all API endpoints

---

## Development Decisions

**Why React?** Component reusability, strong ecosystem, and excellent developer experience with hooks

**Why Flask?** Lightweight, flexible, perfect for small-to-medium APIs with great Python integration

**Why SQLite for Development?** Zero configuration, easy to set up, perfect for local development and prototyping

**Why Lofi Design?** Creates a calm, focused environment that complements the reading tracking experience

---

## Future Enhancements

**Planned Features**
- Reading goals with monthly/yearly targets
- Advanced statistics dashboard with charts
- Book ratings and reviews
- Genre/category tagging system
- Social features for sharing recommendations
- Mobile applications for iOS and Android
- Export reading history as CSV/JSON

**Technical Improvements**
- Deployment to production (Render/Railway)
- Database migrations with Alembic
- Frontend testing with Vitest
- Docker containerization
- Redis caching layer
- Image optimization and CDN

---

## Known Limitations

- Google Books API has rate limits (1,000 requests/day for free tier)
- Single-user sessions (no concurrent editing)
- SQLite not recommended for production deployment
- Cover images dependent on external URLs

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

- Google Books API for book metadata
- Tailwind CSS for the utility-first CSS framework
- Lofi Girl for design inspiration
- Flask and React communities for excellent documentation
