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
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity style={{ width: '18px', height: '18px', color: '#ffffff' }} />
              </div>
              <span style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}>Hover</span>
            </div>
            <a
              href="/create-mapping"
              style={{
                padding: '8px 16px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              + New Mapping
            </a>
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
