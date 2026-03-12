import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:userpassword@localhost:5433/ordersdb"
    PRODUCT_SERVICE_URL: str = "http://product-service:8080"
    JWT_SECRET: str = "dev-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")
        extra = "allow"

settings = Settings()
