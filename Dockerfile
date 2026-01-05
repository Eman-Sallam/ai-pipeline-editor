# Dockerfile - Containerizes the FastAPI service
FROM python:3.10-slim

WORKDIR /app

# Copy application file
COPY app.py .

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn[standard]

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/nodes')" || exit 1

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
