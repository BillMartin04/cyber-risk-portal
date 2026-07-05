import type {
  Identity, IdentityStats, AccessReviewItem, IdentityType, IdentityStatus,
} from '../../models';

export interface IIdentityService {
  getAllIdentities(): Promise<Identity[]>;
  getIdentityById(id: string): Promise<Identity | undefined>;
  getStats(): Promise<IdentityStats>;
  getAccessReviewQueue(): Promise<AccessReviewItem[]>;
  getByType(type: IdentityType): Promise<Identity[]>;
  getByStatus(status: IdentityStatus): Promise<Identity[]>;
  getOverdue(): Promise<Identity[]>;
  search(query: string): Promise<Identity[]>;
}
