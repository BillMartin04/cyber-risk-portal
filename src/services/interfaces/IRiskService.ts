import type { Risk, Issue, ControlStats } from '../../models';

export interface IRiskService {
  getAll(): Risk[];
  getById(domainId: string, riskId: string): Risk | undefined;
  getOpenIssues(risk: Risk): Issue[];
  getControlStats(risk: Risk): ControlStats;
}
