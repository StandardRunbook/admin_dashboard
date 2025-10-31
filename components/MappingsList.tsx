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
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '48px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: '#64748b' }}>No mappings created yet</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
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
                borderBottom: index < mappings.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background-color 0.15s',
                backgroundColor: isExpanded ? '#f8fafc' : '#ffffff',
              }}
              onMouseEnter={(e) => {
                if (!isExpanded) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isExpanded) e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <ChevronRight style={{
                    width: '18px',
                    height: '18px',
                    color: '#94a3b8',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                        {mapping.org} / {mapping.dashboardName}
                      </span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        • {mapping.panelTitle}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>
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
                backgroundColor: '#f8fafc',
                borderBottom: index < mappings.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}>
                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Metric */}
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      METRIC
                    </h4>
                    <code style={{
                      display: 'block',
                      backgroundColor: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                    }}>
                      {mapping.metricName}
                    </code>
                  </div>

                  {/* Log Stream */}
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      LOG STREAM
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Service</span>
                        <span style={{ fontWeight: '500', color: '#0f172a' }}>{mapping.service}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Region</span>
                        <span style={{ fontWeight: '500', color: '#0f172a' }}>{mapping.region}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ color: '#64748b' }}>Stream</span>
                        <code style={{
                          backgroundColor: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          color: '#0f172a',
                          border: '1px solid #e2e8f0',
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
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '12px',
                  color: '#94a3b8',
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
