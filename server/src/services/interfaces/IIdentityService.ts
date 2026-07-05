import type {
  Identity, IdentityType, IdentityRole, IdentityStatus,
  IdentityStats, AccessReviewItem,
} from '../../models';

export interface IIdentityService {
  getAllIdentities(): Identity[];
  getIdentityById(id: string): Identity | undefined;
  getByType(type: IdentityType): Identity[];
  getByRole(role: IdentityRole): Identity[];
  getByStatus(status: IdentityStatus): Identity[];
  getPrivileged(): Identity[];
  getReviewOverdue(): Identity[];
  getStats(): IdentityStats;
  getAccessReviewQueue(): AccessReviewItem[];
  searchIdentities(query: string): Identity[];
}
