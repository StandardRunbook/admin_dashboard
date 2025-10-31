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

      <main style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}>
              Metric Mappings
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Connect metrics to log streams for seamless tracking
            </p>
          </div>

          {/* Filters */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  color: 'rgba(255, 255, 255, 0.4)',
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
                    color: '#ffffff',
                    backgroundColor: '#252525',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  color: '#ffffff',
                  backgroundColor: '#252525',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  color: '#ffffff',
                  backgroundColor: '#252525',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  color: '#ffffff',
                  backgroundColor: '#252525',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>Active filters:</span>
                {searchQuery && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#252525',
                    color: '#ffffff',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
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
                    backgroundColor: '#252525',
                    color: '#ffffff',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    Org: {selectedOrg}
                    <button
                      onClick={() => setSelectedOrg('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
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
                    backgroundColor: '#252525',
                    color: '#ffffff',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    Service: {selectedService}
                    <button
                      onClick={() => setSelectedService('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
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
                    backgroundColor: '#252525',
                    color: '#ffffff',
                    fontSize: '13px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    Region: {selectedRegion}
                    <button
                      onClick={() => setSelectedRegion('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
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
                    color: 'rgba(255, 255, 255, 0.5)',
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
