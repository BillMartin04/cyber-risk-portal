import type { ScoringMethodology } from '../models';
import { scoringRepository } from '../repositories/ScoringRepository';

export interface IScoringService {
  getMethodology(): Promise<ScoringMethodology>;
}

class ScoringServiceImpl implements IScoringService {
  async getMethodology(): Promise<ScoringMethodology> {
    return scoringRepository.fetchMethodology();
  }
}

export const ScoringService: IScoringService = new ScoringServiceImpl();
