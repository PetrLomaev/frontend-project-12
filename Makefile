install:
	npm install

start:
	npx start-server -s ./frontend/build

build:
	make -C frontend build

lint:
	npx eslint .

fix:
	npx eslint --fix .

develop:
	npx start-server -s ./frontend/build & npm -C frontend start