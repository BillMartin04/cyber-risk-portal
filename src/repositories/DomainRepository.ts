import type { Domain } from '../models';
import { DOMAINS } from '../data/cyberRiskData';

// Single Responsibility: owns all raw data access for domains.
// Controllers and services never import DOMAINS directly — they go through here.
export interface IDomainRepository {
  findAll(): Domain[];
  findById(id: string): Domain | undefined;
}

class DomainRepositoryImpl implements IDomainRepository {
  constructor(private readonly source: readonly Domain[]) {}

  findAll(): Domain[] {
    return [...this.source];
  }

  findById(id: string): Domain | undefined {
    return this.source.find(d => d.id === id);
  }
}

export const domainRepository: IDomainRepository = new DomainRepositoryImpl(DOMAINS);
