import type { IScoringService } from './interfaces/IScoringService';
import type { ScoringMethodology, DomainWeight } from '../models';
import type { IScoringRepository } from '../repositories/ScoringRepository';
import { scoringRepository } from '../repositories/ScoringRepository';

class ScoringServiceImpl implements IScoringService {
  constructor(private readonly repo: IScoringRepository) {}

  getMethodology(): ScoringMethodology {
    return this.repo.getMethodology();
  }

  getDomainWeights(): DomainWeight[] {
    return this.repo.getMethodology().domainWeights;
  }

  getCompositeScore(): number {
    return this.repo.getMethodology().compositeScore;
  }
}

export const ScoringService: IScoringService = new ScoringServiceImpl(scoringRepository);
