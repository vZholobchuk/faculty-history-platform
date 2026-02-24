import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET_CODE", "faculty2026")

    
    server = 'my-server-db.database.windows.net'
    database = 'test'
    username = 'CloudSAb8e06639'
    driver = '{ODBC Driver 18 for SQL Server}'
    authentication = 'ActiveDirectoryIntegrated'

    SQLALCHEMY_DATABASE_URI = (
        f'mssql+pyodbc://{username}:@{server}/{database}?driver={driver};'
        f'Authentication={authentication};Encrypt=yes;TrustServerCertificate=no;'
    )

    ADMIN_SECRET_CODE = "faculty2026" 
    ADMIN_LOGIN = "admin"
    ADMIN_PASSWORD = "admin123"