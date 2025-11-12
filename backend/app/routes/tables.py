from fastapi import APIRouter, HTTPException
import sqlite3
from app.database import get_db_connection, close_db_connection

router = APIRouter()

@router.get("/tables")
async def get_tables():
    """Get list of all tables in the database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        close_db_connection(conn)
        return {"tables": tables}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables/{table_name}")
async def get_table_info(table_name: str):
    """Get schema and sample data for a specific table"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get column information
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = [{"name": row[1], "type": row[2]} for row in cursor.fetchall()]
        
        # Get sample data (first 5 rows)
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
        sample_data = [dict(row) for row in cursor.fetchall()]
        
        close_db_connection(conn)
        return {
            "table_name": table_name,
            "columns": columns,
            "sample_data": sample_data
        }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))