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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-stripe flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Create New Mapping</span>
              </div>
            </div>
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
