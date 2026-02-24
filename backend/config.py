import os
import urllib.parse

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")    
    # Azure SQL Database connection string
    params = urllib.parse.quote_plus(
        "Driver={ODBC Driver 18 for SQL Server};"
        "Server=tcp:my-server-db.database.windows.net,1433;"
        "Database=test;"
        "Uid=CloudSAb8e06639;"
        "Pwd=va12sa34@;"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "Connection Timeout=30;"
    )
    SQLALCHEMY_DATABASE_URI = f"mssql+pyodbc:///?odbc_connect={params}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret code for registration (In production, use env var)
    ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET_CODE", "faculty2026") 
    ADMIN_LOGIN = "admin"
    ADMIN_PASSWORD = "admin123"