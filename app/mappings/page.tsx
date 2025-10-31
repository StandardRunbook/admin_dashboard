'use client';

import { useState, useEffect } from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MappingsList from '@/components/MappingsList';
import { db } from '@/lib/db';
import { MetricMapping } from '@/app/dashboard/page';

export default function MappingsPage() {
  const router = useRouter();
  const [mappings, setMappings] = useState<MetricMapping[]>([]);

  useEffect(() => {
    const loadedMappings = db.getMappings();
    setMappings(loadedMappings);
  }, []);

  const handleDeleteMapping = (id: string) => {
    db.deleteMapping(id);
    setMappings(mappings.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-stripe flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Active Mappings</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative mx-auto max-w-5xl px-6 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              All Active Mappings
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {mappings.length}
              </span>
              {mappings.length === 1 ? 'mapping' : 'mappings'} in total
            </p>
          </div>

          <MappingsList mappings={mappings} onDelete={handleDeleteMapping} />
        </div>
      </main>
    </div>
  );
}
