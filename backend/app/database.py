import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sql_runner.db")

def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

def close_db_connection(conn):
    """Close the database connection"""
    if conn:
        conn.close()