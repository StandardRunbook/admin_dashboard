import { createClient } from '@clickhouse/client';

const config: any = {
  url: `http://${process.env.CLICKHOUSE_HOST || 'localhost'}:${process.env.CLICKHOUSE_PORT || '8123'}`,
  username: process.env.CLICKHOUSE_USER || 'default',
  database: process.env.CLICKHOUSE_DATABASE || 'metrics_db',
};

// Only add password if it's set (don't send empty password)
if (process.env.CLICKHOUSE_PASSWORD) {
  config.password = process.env.CLICKHOUSE_PASSWORD;
}

const client = createClient(config);

export default client;
