from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MailMCP Backend"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Datadog
    DD_ENV: str = "development"
    DD_SERVICE: str = "mailmcp-backend"
    DD_VERSION: str = "0.1.0"

    class Config:
        env_file = ".env"

settings = Settings()
