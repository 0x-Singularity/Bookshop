# Bookshop

A warm, inviting web app to track your reading journey. Built with love for book lovers who want a peaceful place to record their progress.

## Features

- Track books you're reading with current page and total pages
- Log reading sessions with page count and time spent
- View your reading history and progress
- Cozy, calming interface designed for comfort

## Design Philosophy

This app embraces a **cozy aesthetic** with:
- Warm, earthy color palettes (soft browns, creams, muted oranges)
- Comfortable typography (think fireside reading)
- Gentle animations and transitions
- Spacious, uncluttered layouts
- Book-inspired design elements (pages, bookmarks, warm lighting effects)

Think: candlelight, a favorite armchair, a steaming cup of tea, and a good book.

## Tech Stack

**Frontend:**
- React with Vite
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

**Backend:**
- Flask (Python)
- SQLAlchemy ORM
- SQLite database
- Flask-CORS

## Project Structure

```
reading-tracker/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Python dependencies
│   └── reading_tracker.db  # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

4. Install Python dependencies:
```bash
pip install flask flask-cors flask-sqlalchemy
```

5. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Install additional packages:
```bash
npm install axios react-router-dom
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. **Add a Book**: Click "Add New Book" and enter the title, author, and total pages
2. **Start Reading**: Update your current page as you read
3. **Log Sessions**: Record each reading session with pages read and time spent
4. **Track Progress**: Watch your progress bars fill up and review your reading history

## Database Schema

**Books Table:**
- id (primary key)
- title
- author
- total_pages
- current_page (defaults to 0)
- status ('reading', 'completed', 'not-started')
- date_started
- date_completed
- created_at

**Reading Sessions Table:**
- id (primary key)
- book_id (foreign key)
- session_date
- pages_read
- duration_minutes
- notes
- created_at

## Future Ideas

- Reading streaks and goals
- Book covers and ratings
- Reading statistics and charts
- Dark mode (for late-night reading)
- Export reading data
- Book recommendations

## Contributing

This is a learning project! Feel free to fork it and make it your own cozy space.

## License

MIT License - feel free to use this for your own reading tracking needs!

## Notes for Developers

This project is designed with beginners in mind:
- Simple, clear code structure
- Comments explaining key concepts
- RESTful API design
- Minimal dependencies
- Local development focused (no deployment complexity)

Happy reading!
