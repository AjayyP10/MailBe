FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*

# Install Datadog Agent (Optional: if you want full agent metrics)
# For simple APM, ddtrace is enough, but for full host metrics on Render, 
# we might need the agent. For now, we will stick to ddtrace for APM 
# and simple logging to keep the image size down and complexity low.
# If full agent is needed, we can uncomment the agent install steps.

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port
EXPOSE 8000

# Run with ddtrace-run for auto-instrumentation
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
