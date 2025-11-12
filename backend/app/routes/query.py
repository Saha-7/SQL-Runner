from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
from app.database import get_db_connection, close_db_connection

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

@router.post("/execute")
async def execute_query(request: QueryRequest):
    """Execute a SQL query and return results"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(request.query)
        
        # Check if it's a SELECT query (returns data)
        if request.query.strip().upper().startswith('SELECT'):
            results = cursor.fetchall()
            data = [dict(row) for row in results]
            return {
                "success": True,
                "data": data,
                "rowCount": len(data)
            }
        else:
            # For INSERT, UPDATE, DELETE
            conn.commit()
            return {
                "success": True,
                "message": f"Query executed successfully. Rows affected: {cursor.rowcount}",
                "rowCount": cursor.rowcount
            }
    except sqlite3.Error as e:
        return {
            "success": False,
            "error": str(e)
        }
    finally:
        close_db_connection(conn)