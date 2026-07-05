import type {
  RiskAppetite, RiskException, EscalationRule,
  GovernanceCommittee, GovernanceDecision, PolicyRecord, GovernanceStats,
} from '../../models';

export interface IGovernanceService {
  getRiskAppetite(): RiskAppetite;
  getActiveExceptions(): RiskException[];
  getExpiringExceptions(withinDays: number): RiskException[];
  getEscalationRules(): EscalationRule[];
  getCommittees(): GovernanceCommittee[];
  getOpenDecisions(): GovernanceDecision[];
  getAllDecisions(): GovernanceDecision[];
  getPolicies(): PolicyRecord[];
  getStats(): GovernanceStats;
}
