# Base image
FROM python:slim

# Set the working directory
WORKDIR /app

# Install the required packages
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Expose the port that the application listens on
EXPOSE 5000

# Set the environment variables
ENV SECRET_KEY=ZLHxbIi6kNbAFz1BTzaLtoni8
ENV DATABASE_URI=postgresql://postgres:postgres@postgres:5432/db
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Start the application
CMD ["python", "main.py"]
