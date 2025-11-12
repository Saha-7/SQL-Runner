from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import query, tables
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SQL Runner API",
    description="API for executing SQL queries",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(query.router, prefix="/api/query", tags=["Query"])
app.include_router(tables.router, prefix="/api", tags=["Tables"])

@app.get("/")
async def root():
    return {"message": "SQL Runner API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}