import type {
  RiskAppetite, RiskException, EscalationRule,
  GovernanceCommittee, GovernanceDecision, PolicyRecord,
} from '../models';
import {
  RISK_APPETITE, EXCEPTIONS, ESCALATION_RULES, COMMITTEES, DECISIONS, POLICIES,
} from '../data/governanceData';

export interface IGovernanceRepository {
  getRiskAppetite(): RiskAppetite;
  findAllExceptions(): RiskException[];
  findEscalationRules(): EscalationRule[];
  findAllCommittees(): GovernanceCommittee[];
  findAllDecisions(): GovernanceDecision[];
  findAllPolicies(): PolicyRecord[];
}

class GovernanceRepositoryImpl implements IGovernanceRepository {
  constructor(
    private readonly appetite:    RiskAppetite,
    private readonly exceptions:  readonly RiskException[],
    private readonly escalations: readonly EscalationRule[],
    private readonly committees:  readonly GovernanceCommittee[],
    private readonly decisions:   readonly GovernanceDecision[],
    private readonly policies:    readonly PolicyRecord[],
  ) {}

  getRiskAppetite(): RiskAppetite           { return this.appetite; }
  findAllExceptions(): RiskException[]      { return [...this.exceptions]; }
  findEscalationRules(): EscalationRule[]   { return [...this.escalations]; }
  findAllCommittees(): GovernanceCommittee[]{ return [...this.committees]; }
  findAllDecisions(): GovernanceDecision[]  { return [...this.decisions]; }
  findAllPolicies(): PolicyRecord[]         { return [...this.policies]; }
}

export const governanceRepository: IGovernanceRepository = new GovernanceRepositoryImpl(
  RISK_APPETITE, EXCEPTIONS, ESCALATION_RULES, COMMITTEES, DECISIONS, POLICIES,
);
