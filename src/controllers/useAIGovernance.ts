import { useMemo } from 'react';
import { AIGovernanceService } from '../services/AIGovernanceService';
import type {
  AIModel, OWASPThreat, NISTAIRMFDomain,
  ShadowAIIncident, AIGovernanceStats,
} from '../models';

export interface AIGovernanceViewModel {
  models:          AIModel[];
  owaspThreats:    OWASPThreat[];
  nistDomains:     NISTAIRMFDomain[];
  shadowIncidents: ShadowAIIncident[];
  stats:           AIGovernanceStats;
}

export function useAIGovernance(): AIGovernanceViewModel {
  const models          = useMemo(() => AIGovernanceService.getAllModels(),        []);
  const owaspThreats    = useMemo(() => AIGovernanceService.getOWASPThreats(),     []);
  const nistDomains     = useMemo(() => AIGovernanceService.getNISTDomains(),      []);
  const shadowIncidents = useMemo(() => AIGovernanceService.getShadowAIIncidents(),[]);
  const stats           = useMemo(() => AIGovernanceService.getGovernanceStats(),  []);

  return { models, owaspThreats, nistDomains, shadowIncidents, stats };
}
