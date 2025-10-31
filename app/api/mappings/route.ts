import { NextResponse } from 'next/server';
import clickhouse from '@/lib/clickhouse';

export async function GET() {
  try {
    const result = await clickhouse.query({
      query: `
        SELECT
          mm.id as id,
          mm.created_at as created_at,
          o.name as org,
          m.dashboard_name as dashboardName,
          m.panel_title as panelTitle,
          m.metric_name as metricName,
          ls.service as service,
          ls.region as region,
          ls.log_stream_name as logStreamName
        FROM (
          SELECT id, created_at, org_id, metric_id, log_stream_id, is_active
          FROM metric_log_mappings FINAL
        ) mm
        LEFT JOIN (
          SELECT id, name FROM organizations FINAL
        ) o ON mm.org_id = o.id
        LEFT JOIN (
          SELECT id, org_id, dashboard_name, panel_title, metric_name FROM metrics FINAL
        ) m ON mm.metric_id = m.id
        LEFT JOIN (
          SELECT id, service, region, log_stream_name FROM log_streams FINAL
        ) ls ON mm.log_stream_id = ls.id
        WHERE mm.is_active = 1
        ORDER BY mm.created_at DESC
      `,
      format: 'JSONEachRow',
    });

    const mappings = await result.json();
    return NextResponse.json(mappings);
  } catch (error) {
    console.error('Error fetching mappings:', error);
    return NextResponse.json({ error: 'Failed to fetch mappings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { org, dashboardName, panelTitle, metricName, service, region, logStreamName } = body;

    // Insert organization if not exists
    await clickhouse.insert({
      table: 'organizations',
      values: [{ name: org }],
      format: 'JSONEachRow',
    });

    // Get org_id
    const orgResult = await clickhouse.query({
      query: `SELECT id FROM organizations WHERE name = {org:String} LIMIT 1`,
      query_params: { org },
      format: 'JSONEachRow',
    });
    const orgData = await orgResult.json() as Array<{ id: string }>;
    const org_id = orgData[0]?.id;

    // Insert metric
    const metric_id = crypto.randomUUID();
    await clickhouse.insert({
      table: 'metrics',
      values: [{
        id: metric_id,
        org_id,
        dashboard_name: dashboardName,
        panel_title: panelTitle,
        metric_name: metricName,
      }],
      format: 'JSONEachRow',
    });

    // Insert log stream
    const log_stream_id = crypto.randomUUID();
    await clickhouse.insert({
      table: 'log_streams',
      values: [{
        id: log_stream_id,
        org_id,
        service,
        region,
        log_stream_name: logStreamName,
      }],
      format: 'JSONEachRow',
    });

    // Insert mapping
    const mapping_id = crypto.randomUUID();
    await clickhouse.insert({
      table: 'metric_log_mappings',
      values: [{
        id: mapping_id,
        org_id,
        metric_id,
        log_stream_id,
        is_active: 1,
      }],
      format: 'JSONEachRow',
    });

    return NextResponse.json({
      id: mapping_id,
      org,
      dashboardName,
      panelTitle,
      metricName,
      service,
      region,
      logStreamName,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating mapping:', error);
    return NextResponse.json({ error: 'Failed to create mapping' }, { status: 500 });
  }
}
