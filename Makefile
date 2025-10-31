.PHONY: help dev setup-db create-tables drop-tables reset-db query-mappings docker-up docker-down

# Load environment variables
include .env.local
export

dev: ## Start the development server
	pnpm dev

install: ## Install dependencies
	pnpm install

build: ## Build the application
	pnpm build

# Docker container name
DOCKER_CONTAINER := clickhouse-server

# ClickHouse connection via Docker exec (with password if set)
CLICKHOUSE_DOCKER := docker exec -i $(DOCKER_CONTAINER) clickhouse-client --user=$(CLICKHOUSE_USER) $(if $(CLICKHOUSE_PASSWORD),--password=$(CLICKHOUSE_PASSWORD))

# ClickHouse connection via local client (if installed, with password if set)
CLICKHOUSE_CLIENT := clickhouse-client --host=$(CLICKHOUSE_HOST) --port=9000 --user=$(CLICKHOUSE_USER) $(if $(CLICKHOUSE_PASSWORD),--password=$(CLICKHOUSE_PASSWORD)) --database=$(CLICKHOUSE_DATABASE)

# Use Docker by default, fallback to local client
CLICKHOUSE := $(shell docker ps -q -f name=$(DOCKER_CONTAINER) > /dev/null 2>&1 && echo "$(CLICKHOUSE_DOCKER)" || echo "$(CLICKHOUSE_CLIENT)")

# HTTP interface (works with both Docker and local, with password if set)
CLICKHOUSE_HTTP := curl -X POST "http://$(CLICKHOUSE_HOST):$(CLICKHOUSE_PORT)/?user=$(CLICKHOUSE_USER)$(if $(CLICKHOUSE_PASSWORD),&password=$(CLICKHOUSE_PASSWORD))&database=$(CLICKHOUSE_DATABASE)"

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

docker-up: ## Start ClickHouse in Docker
	@echo "Starting ClickHouse container..."
	@docker run -d \
		--name $(DOCKER_CONTAINER) \
		-p 8123:8123 \
		-p 9000:9000 \
		--ulimit nofile=262144:262144 \
		clickhouse/clickhouse-server
	@echo "ClickHouse container started!"
	@echo "Waiting for ClickHouse to be ready..."
	@sleep 3

docker-down: ## Stop and remove ClickHouse Docker container
	@echo "Stopping ClickHouse container..."
	@docker stop $(DOCKER_CONTAINER) || true
	@docker rm $(DOCKER_CONTAINER) || true
	@echo "ClickHouse container removed!"

setup-db: ## Create the database if it doesn't exist
	@echo "Creating database $(CLICKHOUSE_DATABASE)..."
	@$(CLICKHOUSE) --query="CREATE DATABASE IF NOT EXISTS $(CLICKHOUSE_DATABASE)"
	@echo "Database ready!"

create-tables: ## Create all tables and materialized views
	@echo "Creating tables..."
	@cat schema.sql | $(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE)
	@echo "Tables created successfully!"

drop-tables: ## Drop all tables (WARNING: deletes all data)
	@echo "WARNING: This will delete all tables and data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="DROP VIEW IF EXISTS mv_log_to_metrics"; \
		$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="DROP VIEW IF EXISTS mv_metric_to_logs"; \
		$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="DROP TABLE IF EXISTS metric_log_mappings"; \
		$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="DROP TABLE IF EXISTS log_streams"; \
		$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="DROP TABLE IF EXISTS metrics"; \
		$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="DROP TABLE IF EXISTS organizations"; \
		echo "All tables dropped!"; \
	else \
		echo "Cancelled."; \
	fi

reset-db: drop-tables create-tables ## Drop and recreate all tables

query-mappings: ## Show all active mappings
	@$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="\
		SELECT \
			o.name, \
			m.dashboard_name, \
			m.panel_title, \
			m.metric_name, \
			ls.service, \
			ls.region, \
			ls.log_stream_name \
		FROM metric_log_mappings mm FINAL \
		JOIN organizations o ON mm.org_id = o.id \
		JOIN metrics m ON mm.metric_id = m.id \
		JOIN log_streams ls ON mm.log_stream_id = ls.id \
		WHERE mm.is_active = 1 \
		ORDER BY mm.created_at DESC \
		FORMAT Pretty"

test-connection: ## Test ClickHouse connection
	@echo "Testing connection to ClickHouse..."
	@$(CLICKHOUSE) --query="SELECT version()" && echo "Connection successful!" || echo "Connection failed!"

insert-sample: ## Insert sample data for testing
	@echo "Inserting sample data..."
	@$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="\
		INSERT INTO organizations (id, name) VALUES \
		(generateUUIDv4(), 'acme-corp'), \
		(generateUUIDv4(), 'example-org')"
	@echo "Sample data inserted!"

show-stats: ## Show database statistics
	@echo "Database Statistics:"
	@echo "==================="
	@echo -n "Organizations: "
	@$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="SELECT count() FROM organizations"
	@echo -n "Metrics: "
	@$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="SELECT count() FROM metrics"
	@echo -n "Log Streams: "
	@$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="SELECT count() FROM log_streams"
	@echo -n "Active Mappings: "
	@$(CLICKHOUSE) --database=$(CLICKHOUSE_DATABASE) --query="SELECT count() FROM metric_log_mappings FINAL WHERE is_active = 1"

# HTTP-based alternatives (if clickhouse-client is not available)
create-tables-http: ## Create tables using HTTP (alternative method)
	@echo "Creating tables via HTTP..."
	@cat schema.sql | $(CLICKHOUSE_HTTP) --data-binary @-
	@echo "Tables created successfully!"
