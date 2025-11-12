from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import query, tables, auth  # Add auth import
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SQL Runner API",
    description="API for executing SQL queries",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])  # Add this
app.include_router(query.router, prefix="/api/query", tags=["Query"])
app.include_router(tables.router, prefix="/api", tags=["Tables"])

@app.get("/")
async def root():
    return {"message": "SQL Runner API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}