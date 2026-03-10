from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from src.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app lifecycle - startup and shutdown."""
    # Startup
    print("MailBe Backend Starting Up...")
    # Initialize database connection, cache, etc.
    yield
    # Shutdown
    print("MailBe Backend Shutting Down...")


# Create FastAPI app with lifespan
app = FastAPI(
    title="MailBe Backend",
    description="AI-powered email client backend API",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "environment": settings.environment}


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "MailBe API", "version": "0.1.0"}


# Import and include routes (we'll add these as we build)
# from src.routes import auth, emails, ai, sync

# @app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# @app.include_router(emails.router, prefix="/api/emails", tags=["emails"])
# @app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
# @app.include_router(sync.router, prefix="/api/sync", tags=["sync"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
