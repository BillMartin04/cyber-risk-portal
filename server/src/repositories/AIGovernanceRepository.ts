import type { AIModel, OWASPThreat, NISTAIRMFDomain, ShadowAIIncident } from '../models';
import {
  AI_MODELS, OWASP_THREATS, NIST_AI_RMF_DOMAINS, SHADOW_AI_INCIDENTS,
} from '../data/aiGovernanceData';

// Single Responsibility: owns all raw data access for AI governance entities.
export interface IAIGovernanceRepository {
  findAllModels(): AIModel[];
  findModelById(id: string): AIModel | undefined;
  findOWASPThreats(): OWASPThreat[];
  findNISTDomains(): NISTAIRMFDomain[];
  findShadowAIIncidents(): ShadowAIIncident[];
}

class AIGovernanceRepositoryImpl implements IAIGovernanceRepository {
  constructor(
    private readonly models:         readonly AIModel[],
    private readonly owaspThreats:   readonly OWASPThreat[],
    private readonly nistDomains:    readonly NISTAIRMFDomain[],
    private readonly shadowIncidents: readonly ShadowAIIncident[],
  ) {}

  findAllModels(): AIModel[]                    { return [...this.models]; }
  findModelById(id: string): AIModel | undefined { return this.models.find(m => m.id === id); }
  findOWASPThreats(): OWASPThreat[]             { return [...this.owaspThreats]; }
  findNISTDomains(): NISTAIRMFDomain[]          { return [...this.nistDomains]; }
  findShadowAIIncidents(): ShadowAIIncident[]   { return [...this.shadowIncidents]; }
}

export const aiGovernanceRepository: IAIGovernanceRepository = new AIGovernanceRepositoryImpl(
  AI_MODELS, OWASP_THREATS, NIST_AI_RMF_DOMAINS, SHADOW_AI_INCIDENTS,
);
