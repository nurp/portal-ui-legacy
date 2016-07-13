PROJECT = "Frontend Dev Tools"

PROJECT_DIR ?= ./frontend_dev_tools
PATH  := $(PROJECT_DIR)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

ifndef VERBOSE
	Q := @
	NIL := > /dev/null 2>&1
endif

NODE_ENV ?= development

NO_COLOR=\033[0m
OK_COLOR=\033[32;01m
OK_STRING=$(OK_COLOR)[OK]$(NO_COLOR)
AWK_CMD = awk '{ printf "%-30s %-10s\n",$$1, $$2; }'
PRINT_OK = printf "$@ $(OK_STRING)\n" | $(AWK_CMD)
NODE_ENV_STRING = $(OK_COLOR)[$(NODE_ENV)]$(NO_COLOR)
PRINT_ENV = printf "$@ $(NODE_ENV_STRING)\n" | $(AWK_CMD)

.PHONY: all
all: install dist

.PHONY: server
server:
	$(Q) babel-node ${PROJECT_DIR}/server

.PHONY: schema
schema:
	$(Q) babel-node ${PROJECT_DIR}/bin/updateRelaySchema

.PHONY: install
install:
	$(Q) npm install --loglevel error
	@$(PRINT_OK)

.PHONY: build
build: clean-dist
	@$(PRINT_ENV)
	$(Q) webpack
	@$(PRINT_OK)

.PHONY: dist
dist: prepare build
	@$(PRINT_OK)

.PHONY: prepare
prepare: lint test-once
	@$(PRINT_OK)

.PHONY: browser
browser:
	$(Q) wdio wdio.conf.js
	@$(PRINT_OK)

.PHONY: test
test:
	TEST_ENV=watch karma start ${PROJECT_DIR}/karma.config.js

.PHONY: test-once
test-once:
	TEST_ENV=single karma start ${PROJECT_DIR}/karma.config.js
	@$(PRINT_OK)

.PHONY: lint
lint:
	$(Q) eslint src --ext .js,.jsx
	@$(PRINT_OK)

.PHONY: clean
clean: clean-dist clean-deps
	@$(PRINT_OK)

.PHONY: clean-dist
clean-dist:
	$(Q) rm -rf dist
	@$(PRINT_OK)

.PHONY: clean-deps
clean-deps:
	$(Q) rm -rf node_modules
	@$(PRINT_OK)

.PHONY: update
update:
	$(Q) david
	@$(PRINT_OK)

.PHONY: upgrade
upgrade:
	$(Q) david update
	@$(PRINT_OK)

.PHONY: logs
logs:
	$(Q) node ${PROJECT_DIR}/bin/changelog.js
	@$(PRINT_OK)