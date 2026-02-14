# 📚 Bookshop - Personal Reading Tracker

A cozy, full-stack web application for tracking your reading journey. Built with React and Flask, Bookshop features a beautiful lofi-inspired design with day/night themes, helping readers manage their personal library, log reading sessions, and visualize their progress with intuitive interfaces.

![React](https://img.shields.io/badge/React-18.0-61dafb?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)
![Python](https://img.shields.io/badge/Python-3.8+-3776ab?logo=python)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06b6d4?logo=tailwindcss)

## Features

### Book Management
- **Google Books API Integration** - Search and add books with automatic metadata and cover images
- **Manual Entry** - Add books not found in the API with custom details
- **Status Tracking** - Organize books by reading status (Want to Read, Currently Reading, Completed)
- **Visual Progress** - Real-time progress bars showing completion percentage
- **Book Covers** - Beautiful cover images enhance the library experience

### Reading Analytics
- **Session Logging** - Track individual reading sessions with pages read, duration, and notes
- **Progress Statistics** - View average pages per session, total reading time, and reading speed
- **Reading History** - Complete chronological record of all reading sessions
- **Automatic Updates** - Book status automatically updates based on progress
- **Stats Dashboard** - Quick overview of reading counts and pages read

### User Experience
- **Lofi-Inspired Design** - Monospace fonts, subtle grain texture, and atmospheric aesthetics
- **Day/Night Mode** - Toggle between warm day theme and cool evening night theme with persistent preferences
- **Landing Page** - Welcoming home page with feature highlights and "How It Works" guide
- **Responsive Layout** - Fully functional across desktop, tablet, and mobile devices
- **Intuitive Navigation** - Clean, user-friendly interface with React Router
- **Real-time Filtering** - Filter books by status with instant results
- **Smart Validation** - Form validation prevents data entry errors

## Technology Stack

### Frontend
- **React 18** - Component-based UI with hooks (useState, useEffect, useContext)
- **React Router** - Client-side routing for seamless navigation
- **Tailwind CSS 4** - Utility-first CSS with custom design system
- **Axios** - Promise-based HTTP client for API requests
- **Vite** - Fast build tool and development server
- **Context API** - Theme management and state sharing

### Backend
- **Flask 3.0** - Lightweight Python web framework
- **SQLAlchemy** - SQL toolkit and ORM for database operations
- **SQLite** - Embedded relational database
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **Google Books API** - External API integration for book metadata

### Development Tools
- **Python Virtual Environment** - Isolated dependency management
- **npm** - Package management for frontend dependencies
- **ES6+ JavaScript** - Modern JavaScript features
- **Hot Module Replacement** - Fast development with instant updates

## Project Structure

```
bookshop/
├── backend/
│   ├── app.py                 # Flask application with API routes
│   ├── models.py              # SQLAlchemy database models
│   ├── config.py              # Application configuration
│   ├── requirements.txt       # Python dependencies
│   └── reading_tracker.db     # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── BookCard.jsx
│   │   │   ├── SessionForm.jsx
│   │   │   ├── SessionList.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/             # Page-level components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LibraryPage.jsx
│   │   │   ├── BookDetailPage.jsx
│   │   │   └── AddBookPage.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Theme state management
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles and theme
│   ├── public/
│   │   └── book.png           # Favicon and logo
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.8+
- Internet connection (for Google Books API)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd bookshop
```

#### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```
Backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will run on `http://localhost:5173`

### First-Time Setup
The SQLite database will be automatically created when you first run the backend. Tables are created via SQLAlchemy's `db.create_all()` on application startup.

## Usage

### Navigating the App
- **Home (/)** - Landing page with features and recent books
- **My Library (/library)** - Full library view with filters and stats
- **Add Book (/add)** - Search or manually add new books
- **Book Details** - Click any book to view details and log sessions

### Adding Books
1. Click **"+ Add Book"** in the navigation
2. Search for a book using the Google Books API
3. Select from results (auto-fills metadata and cover)
4. Review and confirm, or edit details manually
5. Book appears in your library immediately

### Tracking Progress
1. Click on any book in your library
2. Use **"Update Current Page"** for quick progress updates
3. Click **"+ Log Session"** to record a detailed reading session
4. Enter pages read, duration, and optional notes
5. View updated statistics and reading history

### Managing Your Library
- **Filter books** using status tabs (All, Currently Reading, Completed, Want to Read)
- **View stats** with the dashboard showing reading counts and total pages
- **View progress** with visual progress bars on each book card
- **Delete books** using the delete button on book cards
- **Delete sessions** to correct mistakes or remove old entries

### Theme Customization
- **Toggle Day/Night Mode** - Click the sun/moon toggle in the top navigation
- **Persistent Preference** - Your theme choice is saved in browser localStorage
- **Smooth Transitions** - All colors smoothly fade between themes

## Database Schema

### Books Table
```sql
id              INTEGER PRIMARY KEY
title           VARCHAR(200) NOT NULL
author          VARCHAR(200) NOT NULL
total_pages     INTEGER NOT NULL
current_page    INTEGER DEFAULT 0
status          VARCHAR(20) DEFAULT 'not-started'
cover_url       VARCHAR(500)
thumbnail_url   VARCHAR(500)
isbn            VARCHAR(20)
google_books_id VARCHAR(100)
date_started    DATE
date_completed  DATE
created_at      DATETIME
```

### Reading Sessions Table
```sql
id               INTEGER PRIMARY KEY
book_id          INTEGER FOREIGN KEY
session_date     DATE NOT NULL
pages_read       INTEGER NOT NULL
duration_minutes INTEGER NOT NULL
notes            TEXT
created_at       DATETIME
```

## API Endpoints

### Books
- `GET /api/books` - Retrieve all books
- `GET /api/books/:id` - Get single book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete book and associated sessions

### Reading Sessions
- `GET /api/books/:id/sessions` - Get all sessions for a book
- `POST /api/sessions` - Create new reading session
- `DELETE /api/sessions/:id` - Delete session

### External API
- `GET /api/search/books?q=query` - Search Google Books API

### Utility
- `GET /api/health` - Health check endpoint

## Design System

### Lofi-Inspired Aesthetic
The interface draws inspiration from lofi study aesthetics, creating a calm, focused environment for tracking reading progress.

**Day Theme:**
- Warm, creamy backgrounds (#F5F1E8)
- Terracotta accent (#D97757)
- Soft shadows and natural tones
- Perfect for daytime reading

**Night Theme:**
- Deep blue-grey backgrounds (#1a2332)
- Warm orange accents (#f5a462) - like cozy lamp light
- Cool exterior blues (#5c8fa3)
- Inspired by evening study sessions

### Typography
- **Display** (DM Serif Display) - Italic headers, elegant and distinctive
- **Body** (IBM Plex Mono) - Monospace text for that coding/study vibe
- **Buttons** (Space Mono) - Bold, retro aesthetic

### Visual Elements
- **Grain Texture** - Subtle noise overlay for vintage atmosphere
- **Custom Scrollbar** - Themed to match accent colors
- **Smooth Transitions** - All theme changes animate smoothly
- **SVG Icons** - Clean, minimal icons replace emoji throughout

### Design Philosophy
The interface evokes the atmosphere of late-night study sessions - monospace fonts, warm lighting against cool backgrounds, and a subtle grain texture that feels like watching through a window. Every element is designed to be calming and focused, making reading tracking as peaceful as reading itself.

## Data Validation

### Frontend Validation
- Required fields enforced on all forms
- Numeric inputs validated for valid ranges
- Page counts cannot exceed book total
- Dates cannot be in the future
- URLs validated for proper format

### Backend Validation
- Request data validated before database operations
- Foreign key constraints ensure data integrity
- Cascade deletes prevent orphaned sessions
- Error responses include descriptive messages

## Future Enhancements

### Planned Features
- **User Authentication** - Multi-user support with accounts and login
- **Reading Goals** - Set and track monthly/yearly reading targets
- **Statistics Dashboard** - Advanced analytics with charts and graphs
- **Book Ratings** - Rate books on a 5-star scale
- **Tags/Categories** - Organize books by genre or custom tags
- **Reading Streaks** - Track consecutive days of reading
- **Export Data** - Download reading history as CSV/JSON
- **Social Features** - Share book recommendations with friends
- **Mobile App** - Native iOS/Android applications
- **Background Music** - Optional lofi music player integration

### Technical Improvements
- Pagination for large book libraries
- Search and sort functionality
- Database migrations with Alembic
- Unit and integration tests
- Docker containerization
- CI/CD pipeline
- Production deployment configuration
- PostgreSQL for production database
- Caching layer for API responses
- Image optimization and CDN

## Known Issues & Limitations

- Google Books API has rate limits (1,000 requests/day for free tier)
- Some books may not have complete metadata in Google Books
- Cover images are dependent on external URLs (could break over time)
- Single-user application (no authentication yet)
- Limited to local development (not production-ready)
- Theme preference stored in localStorage (not synced across devices)

## Development Notes

### Why These Technologies?
- **React**: Component reusability, strong ecosystem, excellent developer experience with hooks
- **Flask**: Lightweight, flexible, perfect for small-to-medium APIs, great Python integration
- **SQLite**: Zero configuration, perfect for local development and prototyping
- **Tailwind CSS**: Rapid UI development, consistent design system, easy theme customization
- **Context API**: Simple state management without external dependencies

### Code Quality
- Consistent naming conventions across frontend and backend
- Component-based architecture for maintainability
- Separation of concerns (routes, models, services, context)
- Error handling on all API calls
- Responsive design patterns throughout
- Theme management using React Context
- CSS custom properties for dynamic theming

### Learning Outcomes
This project demonstrates:
- Full-stack development skills with modern tools
- RESTful API design principles
- Modern React patterns (hooks, routing, context)
- Database modeling and relationships
- External API integration
- UI/UX design sensibility with theme system
- Project structure and organization
- State management patterns

## License

This project is open source and available under the MIT License.