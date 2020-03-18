publish:
	npm publish --dry-run

install:
	npm install

start:
	node bin/gendiff.js

lint:
	npx eslint .
