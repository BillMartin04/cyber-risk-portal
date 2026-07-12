import type { ScoringMethodology } from '../models';
import { scoringMethodologyData } from '../data/scoringMethodologyData';

export interface IScoringRepository {
  getMethodology(): ScoringMethodology;
}

class ScoringRepositoryImpl implements IScoringRepository {
  private readonly data: ScoringMethodology = scoringMethodologyData;

  getMethodology(): ScoringMethodology {
    return this.data;
  }
}

export const scoringRepository: IScoringRepository = new ScoringRepositoryImpl();
