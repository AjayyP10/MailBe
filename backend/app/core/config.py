from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MailBe"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Datadog
    DD_ENV: str = "development"
    DD_SERVICE: str = "mailbe-backend"
    DD_VERSION: str = "0.1.0"

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # AI
    OPENAI_API_KEY: str = "dummy-key" # Default to dummy for vLLM if not set
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4o"

    class Config:
        env_file = ".env"

settings = Settings()
