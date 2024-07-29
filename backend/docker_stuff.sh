docker cp covid_backup.sql $(docker-compose ps -q db):/covid_backup.sql




docker-compose exec -T db psql -U user1 -d covid < /covid_backup.sql



pg_dump -U user1 -h localhost covid > covid_backup.sql

docker exec -it 25b0d9acf457ec18ab64593f02c11f5acbd9f3c85ff4569e31ac15ed3c0ddac6 bash

psql -U user1 -d covid

docker-compose exec db psql -U user1 -d covid -f /docker-entrypoint-initdb.d/covid_backup.sql