import type { ArchitectureData } from '../models';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export interface IArchitectureRepository {
  fetchData(): Promise<ArchitectureData>;
}

class ArchitectureRepositoryImpl implements IArchitectureRepository {
  async fetchData(): Promise<ArchitectureData> {
    const res = await fetch(`${BASE}/api/architecture`);
    if (!res.ok) throw new Error('Failed to fetch architecture data');
    const json = await res.json();
    return json.data as ArchitectureData;
  }
}

export const architectureRepository: IArchitectureRepository = new ArchitectureRepositoryImpl();
