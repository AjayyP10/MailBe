from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    PROJECT_NAME: str = "MailBe"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    DD_ENV: str = "development"
    DD_SERVICE: str = "mailbe-backend"
    DD_VERSION: str = "0.1.0"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GROK_API_KEY: str = ""

settings = Settings()
