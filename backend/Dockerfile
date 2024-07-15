# Use an official Python runtime as the base
FROM python:3.12

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 5001

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV DATABASE_URL=postgresql://user1:password@db/covid
ENV SECRET_KEY=1LAKeDYR83stxYv


# Define a script to run additional setups after database init
CMD ["bash", "/app/entrypoint.sh"]