import { useMemo } from 'react';
import { DomainService } from '../services/DomainService';
import { RiskService }   from '../services/RiskService';
import type { Domain, Risk, ControlStats, Issue } from '../models';

export interface RiskDetailViewModel {
  domain:       Domain | undefined;
  risk:         Risk | undefined;
  controlStats: ControlStats;
  openIssues:   Issue[];
  isNotFound:   boolean;
}

const EMPTY_CONTROL_STATS: ControlStats = {
  total: 0, implemented: 0, partial: 0,
  notImplemented: 0, notApplicable: 0, avgEffectiveness: 0,
};

export function useRiskDetail(domainId: string, riskId: string): RiskDetailViewModel {
  const domain = useMemo(() => DomainService.getById(domainId),           [domainId]);
  const risk   = useMemo(() => RiskService.getById(domainId, riskId),     [domainId, riskId]);

  const controlStats = useMemo(
    () => risk ? RiskService.getControlStats(risk) : EMPTY_CONTROL_STATS,
    [risk],
  );

  const openIssues = useMemo(
    () => risk ? RiskService.getOpenIssues(risk) : [],
    [risk],
  );

  return {
    domain,
    risk,
    controlStats,
    openIssues,
    isNotFound: !domain || !risk,
  };
}
