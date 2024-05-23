lint-frontend:
	make -C frontend lint

install:
	npm install

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

deploy:
	git push

start:
	make start-backend

develop:
	npx start-server & npm -C frontend start

build:
	rm -rf frontend/build
	npm run build