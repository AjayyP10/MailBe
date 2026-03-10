from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = ConfigDict(env_file=".env", case_sensitive=False)
    
    # Database
    database_url: str = "postgresql://mailbe:mailbe_dev_password@postgres:5432/mailbe"
    
    # JWT
    secret_key: str = "your_secret_key_here_change_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Ollama
    ollama_host: str = "http://ollama:11434"
    ollama_model: str = "llama2:7b"  # or mistral:7b
    
    # Authentik
    authentik_url: str = "http://authentik:9000"
    authentik_client_id: str = ""
    authentik_client_secret: str = ""
    
    # Email
    email_from: str = "noreply@mailbe.local"
    
    # Redis
    redis_url: str = "redis://mailbe-redis:6379/0"
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]


settings = Settings()
