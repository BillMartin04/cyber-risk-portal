import { useMemo } from 'react';
import { GovernanceService } from '../services/GovernanceService';
import type {
  RiskAppetite, RiskException, EscalationRule,
  GovernanceCommittee, GovernanceDecision, PolicyRecord, GovernanceStats,
} from '../models';

export interface GovernanceViewModel {
  appetite:         RiskAppetite;
  activeExceptions: RiskException[];
  expiringIn30Days: RiskException[];
  escalationRules:  EscalationRule[];
  committees:       GovernanceCommittee[];
  openDecisions:    GovernanceDecision[];
  allDecisions:     GovernanceDecision[];
  policies:         PolicyRecord[];
  stats:            GovernanceStats;
}

export function useGovernance(): GovernanceViewModel {
  const appetite         = useMemo(() => GovernanceService.getRiskAppetite(),          []);
  const activeExceptions = useMemo(() => GovernanceService.getActiveExceptions(),       []);
  const expiringIn30Days = useMemo(() => GovernanceService.getExpiringExceptions(30),   []);
  const escalationRules  = useMemo(() => GovernanceService.getEscalationRules(),        []);
  const committees       = useMemo(() => GovernanceService.getCommittees(),             []);
  const openDecisions    = useMemo(() => GovernanceService.getOpenDecisions(),           []);
  const allDecisions     = useMemo(() => GovernanceService.getAllDecisions(),            []);
  const policies         = useMemo(() => GovernanceService.getPolicies(),               []);
  const stats            = useMemo(() => GovernanceService.getStats(),                  []);

  return {
    appetite, activeExceptions, expiringIn30Days,
    escalationRules, committees, openDecisions, allDecisions, policies, stats,
  };
}
