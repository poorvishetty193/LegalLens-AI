from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "LegalLens AI API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment
    ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Firebase
    FIREBASE_SERVICE_ACCOUNT_JSON: str = ""
    
    # Gemini AI
    GEMINI_API_KEY: str = ""
    
    # Upload limits
    MAX_UPLOAD_SIZE_MB: int = 4
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
