from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import sqlite3
from app.database import get_db_connection, close_db_connection
from app.auth import get_current_user
from app.query_history import add_query_to_history, get_user_query_history

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

@router.post("/execute")
async def execute_query(request: QueryRequest, current_user: dict = Depends(get_current_user)):
    """Execute a SQL query and return results (Protected route)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(request.query)
        
        # Add to history
        add_query_to_history(current_user['user_id'], request.query)
        
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

@router.get("/history")
async def get_query_history(current_user: dict = Depends(get_current_user)):
    """Get user's recent query history"""
    history = get_user_query_history(current_user['user_id'])
    return {
        "history": history,
        "count": len(history)
    }