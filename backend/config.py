import os
import urllib.parse

class Config:
    # Flask secret key
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    DB_SERVER = os.getenv("DB_SERVER", "my-server-db.database.windows.net")
    DB_NAME = os.getenv("DB_NAME", "test")
    DB_USER = os.getenv("DB_USER", "CloudSAb8e06639")
    DB_PASS = os.getenv("DB_PASS", "va12sa34@")

    params = urllib.parse.quote_plus(
        f"Driver={{ODBC Driver 18 for SQL Server}};"
        f"Server=tcp:{DB_SERVER},1433;"
        f"Database={DB_NAME};"
        f"Uid={DB_USER};"
        f"Pwd={DB_PASS};"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "Connection Timeout=30;"
    )

    SQLALCHEMY_DATABASE_URI = f"mssql+pyodbc:///?odbc_connect={params}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET_CODE", "faculty2026")
    ADMIN_LOGIN = os.getenv("ADMIN_LOGIN", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")