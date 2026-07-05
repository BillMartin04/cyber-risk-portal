import type {
  AIModel, OWASPThreat, NISTAIRMFDomain,
  ShadowAIIncident, AIGovernanceStats, AIRiskTier,
} from '../../models';

export interface IAIGovernanceService {
  getAllModels(): AIModel[];
  getModelById(id: string): AIModel | undefined;
  getModelsByRiskTier(tier: AIRiskTier): AIModel[];
  getOWASPThreats(): OWASPThreat[];
  getNISTDomains(): NISTAIRMFDomain[];
  getShadowAIIncidents(): ShadowAIIncident[];
  getGovernanceStats(): AIGovernanceStats;
  getAvgNISTCoverage(models: AIModel[]): number;
}
