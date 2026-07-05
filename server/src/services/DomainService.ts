import type { Domain, RiskCounts } from '../models';
import type { IDomainRepository } from '../repositories/DomainRepository';
import { domainRepository } from '../repositories/DomainRepository';
import type { IDomainService } from './interfaces/IDomainService';

// Open/Closed: closed for modification, open for extension via IDomainService.
// Dependency Inversion: depends on IDomainRepository abstraction, not raw data.
class DomainServiceImpl implements IDomainService {
  constructor(private readonly repo: IDomainRepository) {}

  getAll(): Domain[] {
    return this.repo.findAll();
  }

  getById(id: string): Domain | undefined {
    return this.repo.findById(id);
  }

  getRiskCounts(domain: Domain): RiskCounts {
    const counts: RiskCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const risk of domain.risks) {
      counts[risk.residualRisk]++;
    }
    return counts;
  }

  getOpenIssueCount(domain: Domain): number {
    return domain.risks.flatMap(r => r.issues).filter(i => i.status !== 'closed').length;
  }

  getNotImplementedControlCount(domain: Domain): number {
    return domain.risks
      .flatMap(r => r.controls)
      .filter(c => c.status === 'not-implemented').length;
  }
}

export const DomainService: IDomainService = new DomainServiceImpl(domainRepository);
