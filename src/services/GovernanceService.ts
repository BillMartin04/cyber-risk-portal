import type {
  RiskAppetite, RiskException, EscalationRule,
  GovernanceCommittee, GovernanceDecision, PolicyRecord,
  GovernanceStats, RiskLevel,
} from '../models';
import type { IGovernanceRepository } from '../repositories/GovernanceRepository';
import { governanceRepository } from '../repositories/GovernanceRepository';
import type { IGovernanceService } from './interfaces/IGovernanceService';

class GovernanceServiceImpl implements IGovernanceService {
  constructor(private readonly repo: IGovernanceRepository) {}

  getRiskAppetite(): RiskAppetite {
    return this.repo.getRiskAppetite();
  }

  getActiveExceptions(): RiskException[] {
    return this.repo.findAllExceptions().filter(e => e.status === 'active');
  }

  getExpiringExceptions(withinDays: number): RiskException[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + withinDays);
    return this.getActiveExceptions().filter(e => new Date(e.expiryDate) <= cutoff);
  }

  getEscalationRules(): EscalationRule[] {
    return this.repo.findEscalationRules();
  }

  getCommittees(): GovernanceCommittee[] {
    return this.repo.findAllCommittees();
  }

  getOpenDecisions(): GovernanceDecision[] {
    return this.repo.findAllDecisions().filter(d => !d.closed);
  }

  getAllDecisions(): GovernanceDecision[] {
    return this.repo.findAllDecisions();
  }

  getPolicies(): PolicyRecord[] {
    return this.repo.findAllPolicies();
  }

  getStats(): GovernanceStats {
    const exceptions = this.repo.findAllExceptions();
    const decisions  = this.repo.findAllDecisions();
    const policies   = this.repo.findAllPolicies();
    const appetite   = this.repo.getRiskAppetite();
    const committees = this.repo.findAllCommittees();

    const active         = exceptions.filter(e => e.status === 'active');
    const expiring       = this.getExpiringExceptions(30);
    const openDecisions  = decisions.filter(d => !d.closed);
    const overdueActions = openDecisions.filter(d => d.dueDate && new Date(d.dueDate) < new Date());
    const policiesOverdue= policies.filter(p => p.status === 'overdue').length;
    const breached       = appetite.thresholds.filter(t => t.breached);

    return {
      activeExceptions:  active.length,
      expiringIn30Days:  expiring.length,
      openDecisions:     openDecisions.length,
      overdueActions:    overdueActions.length,
      policiesOverdue,
      appetiteBreached:  breached.length > 0,
      breachedLevels:    breached.map(b => b.level) as RiskLevel[],
      committees:        committees.length,
    };
  }
}

export const GovernanceService: IGovernanceService =
  new GovernanceServiceImpl(governanceRepository);
