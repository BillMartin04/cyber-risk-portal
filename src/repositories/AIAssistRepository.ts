import type {
  AIAssistRequest, AIAssistResponse, AIApprovalItem, AIStatus,
} from '../models';
import { AI_API_BASE } from '../config/api';

export interface IAIAssistRepository {
  getStatus(): Promise<AIStatus>;
  sendMessage(req: AIAssistRequest): Promise<AIAssistResponse>;
  getApprovalQueue(): Promise<AIApprovalItem[]>;
  approveItem(id: string): Promise<AIApprovalItem>;
  rejectItem(id: string, reason: string): Promise<AIApprovalItem>;
  executeItem(id: string): Promise<AIApprovalItem>;
}

async function aiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${AI_API_BASE}/ai-api${path}`);
  if (!res.ok) throw new Error(`AI API error ${res.status}`);
  return res.json() as Promise<T>;
}

async function aiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${AI_API_BASE}/ai-api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`AI API error ${res.status}`);
  return res.json() as Promise<T>;
}

class AIAssistRepositoryImpl implements IAIAssistRepository {
  getStatus()                           { return aiGet<AIStatus>('/status'); }
  sendMessage(req: AIAssistRequest)     { return aiPost<AIAssistResponse>('/assist', req); }
  getApprovalQueue()                    { return aiGet<AIApprovalItem[]>('/approval-queue'); }
  approveItem(id: string)               { return aiPost<AIApprovalItem>(`/approval-queue/${id}/approve`); }
  rejectItem(id: string, reason: string){ return aiPost<AIApprovalItem>(`/approval-queue/${id}/reject`, { reason }); }
  executeItem(id: string)               { return aiPost<AIApprovalItem>(`/approval-queue/${id}/execute`); }
}

export const aiAssistRepository: IAIAssistRepository = new AIAssistRepositoryImpl();
