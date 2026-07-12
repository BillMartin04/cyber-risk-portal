import type { ScoringMethodology, DomainWeight } from '../../models';

export interface IScoringService {
  getMethodology(): ScoringMethodology;
  getDomainWeights(): DomainWeight[];
  getCompositeScore(): number;
}
