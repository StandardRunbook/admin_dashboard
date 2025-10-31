import { NextResponse } from 'next/server';
import clickhouse from '@/lib/clickhouse';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete by setting is_active to 0
    await clickhouse.insert({
      table: 'metric_log_mappings',
      values: [{
        id,
        is_active: 0,
        deleted_at: new Date().toISOString(),
      }],
      format: 'JSONEachRow',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mapping:', error);
    return NextResponse.json({ error: 'Failed to delete mapping' }, { status: 500 });
  }
}
