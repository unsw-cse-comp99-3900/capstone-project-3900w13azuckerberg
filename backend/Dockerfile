# Use an official Python runtime as the base
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py

# Run database migrations and start the app
# Set environment variables
ENV FLASK_APP=app.py

# Wait for the database to be ready, run migrations, and start the app
CMD ["sh", "-c", "until pg_isready -h db -U myuser; do sleep 1; done; flask db upgrade; flask run --host=0.0.0.0"]