import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET_CODE", "faculty2026")
    SQLALCHEMY_DATABASE_URI = 'sqlite:///faculty.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret code for registration (In production, use env var)
    ADMIN_SECRET_CODE = "faculty2026" 