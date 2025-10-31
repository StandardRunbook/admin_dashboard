'use client';

import { useState, FormEvent } from 'react';

type MetricMappingFormProps = {
  onSubmit: (mapping: {
    org: string;
    dashboardName: string;
    panelTitle: string;
    metricName: string;
    service: string;
    region: string;
    logStreamName: string;
  }) => void;
};

export default function MetricMappingForm({ onSubmit }: MetricMappingFormProps) {
  const [org, setOrg] = useState('acme-corp');
  const [dashboardName, setDashboardName] = useState('production-metrics');
  const [panelTitle, setPanelTitle] = useState('API Performance');
  const [metricName, setMetricName] = useState('api.requests.count');
  const [service, setService] = useState('api-service');
  const [region, setRegion] = useState('us-east-1');
  const [logStreamName, setLogStreamName] = useState('2024/01/01/instance-123');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!org || !dashboardName || !panelTitle || !metricName || !service || !region || !logStreamName) return;

    onSubmit({ org, dashboardName, panelTitle, metricName, service, region, logStreamName });

    setOrg('acme-corp');
    setDashboardName('production-metrics');
    setPanelTitle('API Performance');
    setMetricName('api.requests.count');
    setService('api-service');
    setRegion('us-east-1');
    setLogStreamName('2024/01/01/instance-123');
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '6px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            Metric information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="org" style={labelStyle}>Organization</label>
              <input
                id="org"
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="dashboardName" style={labelStyle}>Dashboard</label>
              <input
                id="dashboardName"
                type="text"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="panelTitle" style={labelStyle}>Panel title</label>
              <input
                id="panelTitle"
                type="text"
                value={panelTitle}
                onChange={(e) => setPanelTitle(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="metricName" style={labelStyle}>Metric name</label>
              <input
                id="metricName"
                type="text"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            Log stream details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label htmlFor="service" style={labelStyle}>Service</label>
              <input
                id="service"
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="region" style={labelStyle}>Region</label>
              <input
                id="region"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="logStreamName" style={labelStyle}>Log stream name</label>
            <input
              id="logStreamName"
              type="text"
              value={logStreamName}
              onChange={(e) => setLogStreamName(e.target.value)}
              style={{...inputStyle, fontFamily: 'monospace'}}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
        >
          Create mapping
        </button>
      </form>
    </div>
  );
}
