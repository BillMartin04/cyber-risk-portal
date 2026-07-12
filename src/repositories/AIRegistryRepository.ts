import { API_BASE } from '../config/api';

export type AIToolStatus       = 'approved' | 'pending' | 'prohibited' | 'under-review' | 'retired';
export type AIToolCategory     = 'generative-ai' | 'code-assistant' | 'data-analysis' | 'automation' | 'search-ai' | 'image-generation' | 'writing-assistant';
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface AIRegistryApprovalEvent {
  date:   string;
  action: string;
  actor:  string;
  note:   string;
}

export interface AIRegistryTool {
  id:                  string;
  name:                string;
  vendor:              string;
  category:            AIToolCategory;
  status:              AIToolStatus;
  riskRating:          'critical' | 'high' | 'medium' | 'low';
  dataClassification:  DataClassification[];
  prohibitedDataTypes: string[];
  businessOwner:       string;
  department:          string;
  useCase:             string;
  description:         string;
  approvedDate?:       string;
  reviewDate:          string;
  nextReviewDate:      string;
  controls:            string[];
  monthlyUsers:        number;
  monthlyCost:         number;
  licenseType:         string;
  dataResidency:       string;
  prohibitionReason?:  string;
  approvalHistory:     AIRegistryApprovalEvent[];
}

export interface AIRegistryStats {
  total:             number;
  approved:          number;
  pending:           number;
  prohibited:        number;
  underReview:       number;
  totalMonthlyCost:  number;
  totalMonthlyUsers: number;
}

export interface IAIRegistryRepository {
  getAll(): Promise<AIRegistryTool[]>;
  getById(id: string): Promise<AIRegistryTool>;
  getStats(): Promise<AIRegistryStats>;
  updateStatus(id: string, status: AIToolStatus, actor: string, note: string): Promise<AIRegistryTool>;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/ai-registry${path}`);
  if (!res.ok) throw new Error(`AI Registry API error ${res.status}`);
  const body = await res.json() as { data: T };
  return body.data;
}

async function apiPatch<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api/ai-registry${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`AI Registry API error ${res.status}`);
  const body = await res.json() as { data: T };
  return body.data;
}

class AIRegistryRepositoryImpl implements IAIRegistryRepository {
  getAll(): Promise<AIRegistryTool[]>           { return apiGet('/'); }
  getById(id: string): Promise<AIRegistryTool>  { return apiGet(`/${id}`); }
  getStats(): Promise<AIRegistryStats>           { return apiGet('/stats'); }
  updateStatus(id: string, status: AIToolStatus, actor: string, note: string): Promise<AIRegistryTool> {
    return apiPatch(`/${id}/status`, { status, actor, note });
  }
}

export const AIRegistryRepository: IAIRegistryRepository = new AIRegistryRepositoryImpl();
