#!/bin/bash
set -e
echo "Initialization script started."

echo "Running covid_backup.sql"
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/covid_backup.sql || {
  echo "Failed to run covid_backup.sql"
  exit 1
}