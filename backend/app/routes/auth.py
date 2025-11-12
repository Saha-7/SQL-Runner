from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
import sqlite3
from app.database import get_db_connection, close_db_connection
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()

# Request/Response models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

# Register endpoint
@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    """Register a new user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if username or email already exists
        cursor.execute("SELECT * FROM Users WHERE username = ? OR email = ?", 
                      (user.username, user.email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already registered")
        
        # Hash password and create user
        hashed_password = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)",
            (user.username, user.email, hashed_password)
        )
        conn.commit()
        
        # Get the created user
        user_id = cursor.lastrowid
        
        # Create token
        access_token = create_access_token(
            data={"sub": user.username, "user_id": user_id}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": user.username
        }
        
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_db_connection(conn)

# Login endpoint
@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """Login user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Find user
        cursor.execute("SELECT user_id, username, password_hash FROM Users WHERE username = ?", 
                      (user.username,))
        db_user = cursor.fetchone()
        
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Verify password
        if not verify_password(user.password, db_user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Create token
        access_token = create_access_token(
            data={"sub": db_user['username'], "user_id": db_user['user_id']}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": db_user['username']
        }
        
    finally:
        close_db_connection(conn)

# Get current user endpoint
@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user info"""
    return current_user