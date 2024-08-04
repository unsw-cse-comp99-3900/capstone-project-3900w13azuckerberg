#!/bin/bash
docker-compose down

# Build and start the containers
docker-compose up -d --build

# Wait for the db service to be healthy
echo "Waiting for the db service to be healthy..."
until [ "$(docker inspect --format='{{json .State.Health.Status}}' $(docker-compose ps -q db))" == "\"healthy\"" ]; do
  sleep 5
done

sleep 5

# Execute the SQL script
echo "Running covid_backup.sql..."
# Run the docker-compose command in the background
docker-compose exec -T db psql -U user1 -d covid < db/covid_backup.sql > /dev/null &

# Get the process ID of the last background command
PID=$!

# While the process is running, print a dot every second
while kill -0 $PID 2> /dev/null; do
    echo -n "..."
    sleep 1
done

# Print a newline after the process completes
echo " Done."
echo "SQL script executed."
echo "The database setup is completed."