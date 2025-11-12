# SQL Runner Application

A full-stack web application for executing SQL queries built with React (Frontend) and FastAPI (Backend).

## Features

- 🔍 Execute SQL queries in real-time
- 📊 View query results in a tabular format
- 📋 Browse available database tables with schema preview
- ⏱️ Recent query history (last 5 queries)
- 🐳 Fully Dockerized for easy deployment

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios for API calls


### Backend
- Python FastAPI
- SQLite Database
- CORS middleware

## Prerequisites

- **Without Docker:**
  - Node.js 16+ and npm
  - Python 3.8+
  - SQLite3

- **With Docker:**
  - Docker
  - Docker Compose

---

## Setup Instructions

### Option 1: Running with Docker (Recommended)

1. **Clone the repository:**
```bash
   git clone <your-repo-url>
   cd sql-runner
```

2. **Make sure the database file exists:**
```bash
   # The sql_runner.db should already be in the backend folder
   # If not, follow the database setup instructions below
```

3. **Build and run with Docker Compose:**
```bash
   docker-compose up --build
```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. **Stop the application:**
```bash
   docker-compose down
```

### Option 2: Running Locally (Development)

#### Backend Setup

1. **Navigate to backend folder:**
```bash
   cd backend
```

2. **Create virtual environment:**
```bash
   python -m venv venv
   
   # Activate it:
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
```

3. **Install dependencies:**
```bash
   pip install -r requirements.txt
```

4. **Set up the database (if not exists):**
```bash
   sqlite3 sql_runner.db
   # Then run the SQL commands from the assignment document
   # or copy the existing sql_runner.db file
```

5. **Run the backend:**
```bash
   uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

1. **Open a new terminal and navigate to frontend folder:**
```bash
   cd frontend
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Run the frontend:**
```bash
   npm run dev
```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

---

## Database Setup

The application uses SQLite with three tables:

- **Customers**: Customer information
- **Orders**: Order details
- **Shippings**: Shipping status

To create the database from scratch:
```bash
cd backend
sqlite3 sql_runner.db
```

Then run the SQL commands provided in the assignment document to create tables and insert sample data.

---

## Docker Commands Reference
```bash
# Build and start containers
docker-compose up --build

# Start containers in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Remove all containers, networks, and volumes
docker-compose down -v
```

---

## Development with Docker

For development with hot-reload:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will:
- Enable hot-reload for both frontend and backend
- Mount your local code into containers
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## Project Structure
```
sql-runner/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── query.py
│   │       └── tables.py
│   ├── sql_runner.db
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QueryInput.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── TablesPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## API Endpoints

### Query Execution
- `POST /api/query/execute` - Execute SQL query

### Table Information
- `GET /api/tables` - Get list of all tables
- `GET /api/tables/{table_name}` - Get table schema and sample data

---

## Features Implemented

✅ SQL Query Editor with syntax highlighting
✅ Results display in tabular format
✅ Available tables panel with schema preview
✅ Query history (last 5 queries) with LocalStorage
✅ Error handling and loading states
✅ Fully Dockerized application
✅ CORS configuration
✅ Responsive UI with Tailwind CSS

---

## Sample Queries
```sql
-- Get all customers
SELECT * FROM Customers;

-- Get orders over 300
SELECT * FROM Orders WHERE amount > 300;

-- Join customers with orders
SELECT c.first_name, c.last_name, o.item, o.amount 
FROM Customers c 
JOIN Orders o ON c.customer_id = o.customer_id;
```



---

## Author

Pritam Saha