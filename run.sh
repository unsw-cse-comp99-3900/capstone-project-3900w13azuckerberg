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
docker-compose exec -T db psql -U user1 -d covid < db/covid_backup.sql

echo "SQL script executed."