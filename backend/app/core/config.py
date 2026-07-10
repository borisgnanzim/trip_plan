import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    POSTGRES_HOST = os.getenv("POSTGRES_HOST")
    POSTGRES_DB = os.getenv("POSTGRES_DB")
    POSTGRES_USER = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")

    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGO = "HS256"

    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    OPENTRIPMAP_API_KEY = os.getenv("OPENTRIPMAP_API_KEY")

settings = Settings()
