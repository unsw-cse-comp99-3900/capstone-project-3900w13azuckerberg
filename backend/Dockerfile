# Use an official Python runtime as the base
FROM python:3.12

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Set the working directory
WORKDIR /app/backend

# Remove any existing 'seirsplus' directory
RUN rm -rf seirsplus

# Clone your forked repository and install the seirsplus package
RUN git clone https://github.com/lindawang01/seirsplus.git

WORKDIR /app/backend/seirsplus
# Uninstall any existing seirsplus packages
RUN pip uninstall -y seirsplus || true
# Install the seirsplus package from the local cloned repository
RUN pip install --no-cache-dir .

# Set the working directory for your application
WORKDIR /app

# Copy the rest of the application code to the container
COPY . /app

# Copy the requirements file and install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Define a script to run additional setups after database init
CMD ["bash", "/app/entrypoint.sh"]