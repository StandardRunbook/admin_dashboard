'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import MetricMappingForm from '@/components/MetricMappingForm';
import MappingsList from '@/components/MappingsList';

export type MetricMapping = {
  id: string;
  org: string;
  dashboardName: string;
  panelTitle: string;
  metricName: string;
  service: string;
  region: string;
  logStreamName: string;
  createdAt: Date;
};

export default function DashboardPage() {
  const [mappings, setMappings] = useState<MetricMapping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    try {
      const response = await fetch('/api/mappings');
      const data = await response.json();

      if (Array.isArray(data)) {
        setMappings(data.map((m: any) => ({
          ...m,
          createdAt: new Date(m.created_at),
        })));
      } else {
        console.error('API error:', data);
        setMappings([]);
      }
    } catch (error) {
      console.error('Error fetching mappings:', error);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      await fetch(`/api/mappings/${id}`, { method: 'DELETE' });
      setMappings(mappings.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting mapping:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-stripe flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Metrics Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Metric Mappings
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {mappings.length}
              </span>
              active {mappings.length === 1 ? 'mapping' : 'mappings'}
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">All Active Mappings</h2>
            <a
              href="/create-mapping"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              + Create New Mapping
            </a>
          </div>

          <MappingsList
            mappings={mappings}
            onDelete={handleDeleteMapping}
          />
        </div>
      </main>
    </div>
  );
}
