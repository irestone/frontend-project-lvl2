install: install-deps

run:
	npx babel-node 'src/bin/gendiff.js' $(ARGS)

install-deps:
	npm ci

build:
	rm -rf dist
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage

test-watch:
	npm test -- --watch

lint:
	npx eslint .

publish:
	npm publish --dry-run

.PHONY: test
