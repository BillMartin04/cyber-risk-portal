import type { Domain, RiskCounts } from '../../models';

export interface IDomainService {
  getAll(): Domain[];
  getById(id: string): Domain | undefined;
  getRiskCounts(domain: Domain): RiskCounts;
  getOpenIssueCount(domain: Domain): number;
  getNotImplementedControlCount(domain: Domain): number;
}
