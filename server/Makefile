include ./.env

migrate:
	cd ./pkg/sql/schema && goose postgres $(DB_URL) up
kill-server:
	~/scripts/kill_process.sh 5000