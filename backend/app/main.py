from fastapi import FastAPI
from app.core.config import settings
from supabase import create_client, Client

from app.api import ai, email

app = FastAPI(title=settings.PROJECT_NAME)

# Initialize Supabase Client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(email.router, prefix="/api/email", tags=["Email"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.DD_SERVICE,
        "version": settings.DD_VERSION
    }

@app.get("/")
def root():
    return {"message": "Welcome to MailMCP API"}
