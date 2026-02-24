import os
import urllib.parse

class Config:
    # Flask secret key
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")    

    # Azure SQL Database connection string using environment variables
    params = urllib.parse.quote_plus(
        f"Driver={{ODBC Driver 18 for SQL Server}};"
        f"Server={os.environ.get('DB_SERVER')};"
        f"Database={os.environ.get('DB_NAME')};"
        f"Uid={os.environ.get('DB_USER')};"
        f"Pwd={os.environ.get('DB_PASSWORD')};"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "Connection Timeout=30;"
    )

    SQLALCHEMY_DATABASE_URI = f"mssql+pyodbc:///?odbc_connect={params}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Admin credentials for registration/login
    ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET_CODE", "faculty2026")
    ADMIN_LOGIN = os.getenv("ADMIN_LOGIN", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")