import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:userpassword@localhost:5434/productdb"
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    class Config:
        # Resolve .env relative to this file so it works regardless of cwd
        env_file = os.path.join(os.path.dirname(__file__), ".env")
        extra = "allow"

settings = Settings()
