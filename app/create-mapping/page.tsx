'use client';

import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft } from 'lucide-react';
import MetricMappingForm from '@/components/MetricMappingForm';

type MetricMapping = {
  org: string;
  dashboardName: string;
  panelTitle: string;
  metricName: string;
  service: string;
  region: string;
  logStreamName: string;
};

export default function CreateMappingPage() {
  const router = useRouter();

  const handleAddMapping = async (mapping: MetricMapping) => {
    try {
      await fetch('/api/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping),
      });
      router.push('/');
    } catch (error) {
      console.error('Error creating mapping:', error);
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
            <button
              onClick={() => router.push('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative mx-auto max-w-2xl px-6 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Create New Mapping
            </h1>
            <p className="text-muted-foreground">
              Connect your metrics to log streams
            </p>
          </div>

          <MetricMappingForm onSubmit={handleAddMapping} />
        </div>
      </main>
    </div>
  );
}
