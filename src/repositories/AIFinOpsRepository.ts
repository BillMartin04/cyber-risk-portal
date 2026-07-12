import type { AIFinOpsData } from '../models';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export interface IAIFinOpsRepository {
  fetchData(): Promise<AIFinOpsData>;
}

class AIFinOpsRepositoryImpl implements IAIFinOpsRepository {
  async fetchData(): Promise<AIFinOpsData> {
    const res = await fetch(`${BASE}/api/ai-finops`);
    if (!res.ok) throw new Error('Failed to fetch AI FinOps data');
    const json = await res.json();
    return json.data as AIFinOpsData;
  }
}

export const aiFinOpsRepository: IAIFinOpsRepository = new AIFinOpsRepositoryImpl();
