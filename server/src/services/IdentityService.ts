import type {
  Identity, IdentityType, IdentityRole, IdentityStatus,
  IdentityStats, AccessReviewItem,
} from '../models';
import type { IIdentityRepository } from '../repositories/IdentityRepository';
import { identityRepository } from '../repositories/IdentityRepository';
import type { IIdentityService } from './interfaces/IIdentityService';

class IdentityServiceImpl implements IIdentityService {
  constructor(private readonly repo: IIdentityRepository) {}

  getAllIdentities(): Identity[] {
    return this.repo.findAll();
  }

  getIdentityById(id: string): Identity | undefined {
    return this.repo.findById(id);
  }

  getByType(type: IdentityType): Identity[] {
    return this.repo.findByType(type);
  }

  getByRole(role: IdentityRole): Identity[] {
    return this.repo.findByRole(role);
  }

  getByStatus(status: IdentityStatus): Identity[] {
    return this.repo.findByStatus(status);
  }

  getPrivileged(): Identity[] {
    return this.repo.findPrivileged();
  }

  getReviewOverdue(): Identity[] {
    return this.repo.findReviewOverdue();
  }

  getStats(): IdentityStats {
    return this.repo.getStats();
  }

  getAccessReviewQueue(): AccessReviewItem[] {
    return this.repo.getAccessReviewQueue();
  }

  searchIdentities(query: string): Identity[] {
    const q = query.toLowerCase();
    return this.repo.findAll().filter(i =>
      i.displayName.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.department.toLowerCase().includes(q) ||
      i.role.toLowerCase().includes(q) ||
      i.tags.some(t => t.includes(q))
    );
  }
}

export const IdentityService: IIdentityService = new IdentityServiceImpl(identityRepository);
