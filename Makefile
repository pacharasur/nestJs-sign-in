run:
	docker compose up -d
up:
	docker compose up
log:
	docker compose logs -f
down:
	docker compose down
build:
	docker compose up --build
env:
	cp .env.example .env