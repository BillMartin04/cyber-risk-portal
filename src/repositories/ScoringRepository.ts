import type { ScoringMethodology } from '../models';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export interface IScoringRepository {
  fetchMethodology(): Promise<ScoringMethodology>;
}

class ScoringRepositoryImpl implements IScoringRepository {
  async fetchMethodology(): Promise<ScoringMethodology> {
    const res = await fetch(`${BASE}/api/scoring/methodology`);
    if (!res.ok) throw new Error('Failed to fetch scoring methodology');
    const json = await res.json();
    return json.data as ScoringMethodology;
  }
}

export const scoringRepository: IScoringRepository = new ScoringRepositoryImpl();
