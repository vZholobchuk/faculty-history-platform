# Use official slim Python image
FROM python:3.11-slim

# Install system dependencies needed for pyodbc and ODBC driver
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    unixodbc-dev \
    build-essential \
    ca-certificates \
    apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

# Add Microsoft repository key and source list for SQL Server ODBC driver
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-prod.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
       > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose Flask port
EXPOSE 5000

# Start Flask app
CMD ["gunicorn", "run:app", "--bind", "0.0.0.0:5000"]