'use client';

import { useState } from 'react';
import { MetricMapping } from '@/app/dashboard/page';
import { Trash2, ChevronRight } from 'lucide-react';

type MappingsListProps = {
  mappings: MetricMapping[];
  onDelete: (id: string) => void;
};

export default function MappingsList({ mappings, onDelete }: MappingsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (mappings.length === 0) {
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '48px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>No mappings created yet</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    }}>
      {mappings.map((mapping, index) => {
        const isExpanded = expandedId === mapping.id;

        return (
          <div key={mapping.id}>
            {/* Compact Row */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : mapping.id)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                borderBottom: index < mappings.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                transition: 'background-color 0.15s',
                backgroundColor: isExpanded ? '#252525' : '#1a1a1a',
              }}
              onMouseEnter={(e) => {
                if (!isExpanded) e.currentTarget.style.backgroundColor = '#252525';
              }}
              onMouseLeave={(e) => {
                if (!isExpanded) e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <ChevronRight style={{
                    width: '18px',
                    height: '18px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>
                        {mapping.org} / {mapping.dashboardName}
                      </span>
                      <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        • {mapping.panelTitle}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                      {mapping.metricName} → {mapping.service}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(mapping.id);
                  }}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div style={{
                padding: '20px',
                backgroundColor: '#252525',
                borderBottom: index < mappings.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              }}>
                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Metric */}
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px' }}>
                      METRIC
                    </h4>
                    <code style={{
                      display: 'block',
                      backgroundColor: '#1a1a1a',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      {mapping.metricName}
                    </code>
                  </div>

                  {/* Log Stream */}
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px' }}>
                      LOG STREAM
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Service</span>
                        <span style={{ fontWeight: '500', color: '#ffffff' }}>{mapping.service}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Region</span>
                        <span style={{ fontWeight: '500', color: '#ffffff' }}>{mapping.region}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Stream</span>
                        <code style={{
                          backgroundColor: '#1a1a1a',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}>
                          {mapping.logStreamName}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}>
                  Created {mapping.createdAt.toLocaleDateString()} at {mapping.createdAt.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
