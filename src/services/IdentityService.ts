import type { Identity, IdentityStats, AccessReviewItem, IdentityType, IdentityStatus } from '../models';
import type { IIdentityRepository } from '../repositories/IdentityRepository';
import { identityRepository } from '../repositories/IdentityRepository';
import type { IIdentityService } from './interfaces/IIdentityService';

class IdentityServiceImpl implements IIdentityService {
  constructor(private readonly repo: IIdentityRepository) {}

  getAllIdentities()                     { return this.repo.fetchAll(); }
  getIdentityById(id: string)           { return this.repo.fetchById(id); }
  getStats()                            { return this.repo.fetchStats(); }
  getAccessReviewQueue()                { return this.repo.fetchAccessReviewQueue(); }
  getByType(type: IdentityType)         { return this.repo.fetchByType(type); }
  getByStatus(status: IdentityStatus)   { return this.repo.fetchByStatus(status); }
  getOverdue()                          { return this.repo.fetchOverdue(); }
  search(query: string)                 { return this.repo.search(query); }
}

export const IdentityService: IIdentityService = new IdentityServiceImpl(identityRepository);
