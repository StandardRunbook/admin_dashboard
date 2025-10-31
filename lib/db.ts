import { MetricMapping } from '@/app/dashboard/page';

const STORAGE_KEY = 'metric_mappings';

export const db = {
  getMappings: (): MetricMapping[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    return JSON.parse(data).map((m: any) => ({
      ...m,
      createdAt: new Date(m.createdAt),
    }));
  },

  saveMappings: (mappings: MetricMapping[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  },

  addMapping: (mapping: MetricMapping): void => {
    const mappings = db.getMappings();
    mappings.push(mapping);
    db.saveMappings(mappings);
  },

  deleteMapping: (id: string): void => {
    const mappings = db.getMappings();
    const filtered = mappings.filter((m) => m.id !== id);
    db.saveMappings(filtered);
  },

  updateMapping: (id: string, updates: Partial<MetricMapping>): void => {
    const mappings = db.getMappings();
    const index = mappings.findIndex((m) => m.id === id);
    if (index !== -1) {
      mappings[index] = { ...mappings[index], ...updates };
      db.saveMappings(mappings);
    }
  },
};
