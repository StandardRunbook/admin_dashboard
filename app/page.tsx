'use client';

import { useState, useEffect } from 'react';
import { Activity, Search } from 'lucide-react';
import MetricMappingForm from '@/components/MetricMappingForm';
import MappingsList from '@/components/MappingsList';

export type MetricMapping = {
  id: string;
  // Metric designation
  org: string;
  dashboardName: string;
  panelTitle: string;
  metricName: string;
  // Log designation
  service: string;
  region: string;
  logStreamName: string;
  createdAt: Date;
};

export default function Home() {
  const [mappings, setMappings] = useState<MetricMapping[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
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

  // Get unique values for filters
  const uniqueOrgs = Array.from(new Set(mappings.map(m => m.org))).sort();
  const uniqueServices = Array.from(new Set(mappings.map(m => m.service))).sort();
  const uniqueRegions = Array.from(new Set(mappings.map(m => m.region))).sort();

  // Filter mappings
  const filteredMappings = mappings.filter(mapping => {
    const matchesSearch = searchQuery === '' ||
      mapping.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.dashboardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.panelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.metricName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.logStreamName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrg = selectedOrg === '' || mapping.org === selectedOrg;
    const matchesService = selectedService === '' || mapping.service === selectedService;
    const matchesRegion = selectedRegion === '' || mapping.region === selectedRegion;

    return matchesSearch && matchesOrg && matchesService && matchesRegion;
  });

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

          {/* Filters */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px',
          }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '16px', width: '100%' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />
                <input
                  type="text"
                  placeholder="Search mappings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    fontSize: '14px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Dropdown Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {/* Organization Filter */}
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">All Organizations</option>
                {uniqueOrgs.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>

              {/* Service Filter */}
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">All Services</option>
                {uniqueServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>

              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">All Regions</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedOrg || selectedService || selectedRegion) && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Active filters:</span>
                {searchQuery && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',
                        lineHeight: '1',
                      }}
                    >×</button>
                  </span>
                )}
                {selectedOrg && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Org: {selectedOrg}
                    <button
                      onClick={() => setSelectedOrg('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',
                        lineHeight: '1',
                      }}
                    >×</button>
                  </span>
                )}
                {selectedService && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Service: {selectedService}
                    <button
                      onClick={() => setSelectedService('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',
                        lineHeight: '1',
                      }}
                    >×</button>
                  </span>
                )}
                {selectedRegion && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Region: {selectedRegion}
                    <button
                      onClick={() => setSelectedRegion('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',
                        lineHeight: '1',
                      }}
                    >×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedOrg('');
                    setSelectedService('');
                    setSelectedRegion('');
                  }}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'transparent',
                    color: '#64748b',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <MappingsList
            mappings={filteredMappings}
            onDelete={handleDeleteMapping}
          />
        </div>
      </main>
    </div>
  );
}
