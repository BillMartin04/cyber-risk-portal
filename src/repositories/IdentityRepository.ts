import type {
  Identity, IdentityStats, AccessReviewItem, IdentityType, IdentityRole, IdentityStatus,
} from '../models';
import { API_BASE } from '../config/api';

export interface IIdentityRepository {
  fetchAll(): Promise<Identity[]>;
  fetchById(id: string): Promise<Identity | undefined>;
  fetchStats(): Promise<IdentityStats>;
  fetchAccessReviewQueue(): Promise<AccessReviewItem[]>;
  fetchByType(type: IdentityType): Promise<Identity[]>;
  fetchByStatus(status: IdentityStatus): Promise<Identity[]>;
  fetchOverdue(): Promise<Identity[]>;
  search(query: string): Promise<Identity[]>;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/identities${path}`);
  if (!res.ok) throw new Error(`Identity API error: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

class IdentityRepositoryImpl implements IIdentityRepository {
  fetchAll()                            { return apiGet<Identity[]>('/'); }
  fetchById(id: string)                 { return apiGet<Identity>(`/${id}`).catch(() => undefined as unknown as Identity); }
  fetchStats()                          { return apiGet<IdentityStats>('/stats'); }
  fetchAccessReviewQueue()              { return apiGet<AccessReviewItem[]>('/access-review'); }
  fetchByType(type: IdentityType)       { return apiGet<Identity[]>(`/by-type/${type}`); }
  fetchByStatus(status: IdentityStatus) { return apiGet<Identity[]>(`/by-status/${status}`); }
  fetchOverdue()                        { return apiGet<Identity[]>('/overdue'); }
  search(query: string)                 { return apiGet<Identity[]>(`/search?q=${encodeURIComponent(query)}`); }
}

export const identityRepository: IIdentityRepository = new IdentityRepositoryImpl();
