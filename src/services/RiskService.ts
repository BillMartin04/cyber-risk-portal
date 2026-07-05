import type { Risk, Issue, ControlStats } from '../models';
import type { IDomainRepository } from '../repositories/DomainRepository';
import { domainRepository } from '../repositories/DomainRepository';
import type { IRiskService } from './interfaces/IRiskService';

class RiskServiceImpl implements IRiskService {
  constructor(private readonly repo: IDomainRepository) {}

  getAll(): Risk[] {
    return this.repo.findAll().flatMap(d => d.risks);
  }

  getById(domainId: string, riskId: string): Risk | undefined {
    return this.repo.findById(domainId)?.risks.find(r => r.id === riskId);
  }

  getOpenIssues(risk: Risk): Issue[] {
    return risk.issues.filter(i => i.status !== 'closed');
  }

  getControlStats(risk: Risk): ControlStats {
    const controls     = risk.controls;
    const implemented  = controls.filter(c => c.status === 'implemented').length;
    const partial      = controls.filter(c => c.status === 'partial').length;
    const notImpl      = controls.filter(c => c.status === 'not-implemented').length;
    const notApplicable= controls.filter(c => c.status === 'not-applicable').length;
    const avgEffectiveness = controls.length > 0
      ? Math.round(controls.reduce((sum, c) => sum + c.effectiveness, 0) / controls.length)
      : 0;

    return { total: controls.length, implemented, partial, notImplemented: notImpl, notApplicable, avgEffectiveness };
  }
}

export const RiskService: IRiskService = new RiskServiceImpl(domainRepository);
