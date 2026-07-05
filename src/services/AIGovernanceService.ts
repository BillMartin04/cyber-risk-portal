import type {
  AIModel, OWASPThreat, NISTAIRMFDomain,
  ShadowAIIncident, AIGovernanceStats, AIRiskTier,
} from '../models';
import type { IAIGovernanceRepository } from '../repositories/AIGovernanceRepository';
import { aiGovernanceRepository } from '../repositories/AIGovernanceRepository';
import type { IAIGovernanceService } from './interfaces/IAIGovernanceService';

class AIGovernanceServiceImpl implements IAIGovernanceService {
  constructor(private readonly repo: IAIGovernanceRepository) {}

  getAllModels(): AIModel[] {
    return this.repo.findAllModels();
  }

  getModelById(id: string): AIModel | undefined {
    return this.repo.findModelById(id);
  }

  getModelsByRiskTier(tier: AIRiskTier): AIModel[] {
    return this.repo.findAllModels().filter(m => m.riskTier === tier);
  }

  getOWASPThreats(): OWASPThreat[] {
    return this.repo.findOWASPThreats();
  }

  getNISTDomains(): NISTAIRMFDomain[] {
    return this.repo.findNISTDomains();
  }

  getShadowAIIncidents(): ShadowAIIncident[] {
    return this.repo.findShadowAIIncidents();
  }

  getAvgNISTCoverage(models: AIModel[]): number {
    if (models.length === 0) return 0;
    const total = models.reduce((sum, m) => {
      const fns = Object.values(m.nistRMFCoverage);
      return sum + fns.reduce((s, v) => s + v, 0) / fns.length;
    }, 0);
    return Math.round(total / models.length);
  }

  getGovernanceStats(): AIGovernanceStats {
    const models   = this.repo.findAllModels();
    const threats  = this.repo.findOWASPThreats();
    const shadow   = this.repo.findShadowAIIncidents();

    return {
      totalModels:            models.length,
      productionModels:       models.filter(m => m.deploymentStatus === 'production').length,
      criticalRiskModels:     models.filter(m => m.riskTier === 'critical').length,
      highRiskModels:         models.filter(m => m.riskTier === 'high').length,
      pendingApproval:        models.filter(m => ['pending', 'under-review'].includes(m.approvalStatus)).length,
      totalOpenIssues:        models.reduce((s, m) => s + m.openIssues, 0),
      shadowAIIncidents:      shadow.reduce((s, i) => s + i.incidents, 0),
      avgNISTCoverage:        this.getAvgNISTCoverage(models),
      owaspThreatsIdentified: threats.reduce((s, t) => s + t.affectedModels, 0),
      owaspThreatsMitigated:  threats.reduce((s, t) => s + t.mitigatedModels, 0),
    };
  }
}

export const AIGovernanceService: IAIGovernanceService =
  new AIGovernanceServiceImpl(aiGovernanceRepository);
