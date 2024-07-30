docker cp covid_backup.sql $(docker-compose ps -q db):/covid_backup.sql




docker-compose exec -T db psql -U user1 -d covid < /covid_backup.sql



pg_dump -U user1 -h localhost covid > covid_backup.sql

docker exec -it c51855aebe0f11faca3ceabea3fb06a621ad7d35e2a6b0f3aabb1cac4e416a90 bash

psql -U user1 -d covid

select * from lab_location ;

docker-compose exec db psql -U user1 -d covid -f /docker-entrypoint-initdb.d/covid_backup.sql