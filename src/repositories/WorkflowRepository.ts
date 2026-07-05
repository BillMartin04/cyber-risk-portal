import type {
  WorkflowInstance, WorkflowDefinition,
  WorkflowTransitionRequest, StartWorkflowRequest,
} from '../models';
import { API_BASE } from '../config/api';

export interface IWorkflowRepository {
  listInstances(): Promise<WorkflowInstance[]>;
  getInstance(id: string): Promise<WorkflowInstance>;
  listDefinitions(): Promise<WorkflowDefinition[]>;
  getAvailableTransitions(id: string): Promise<string[]>;
  start(req: StartWorkflowRequest): Promise<WorkflowInstance>;
  transition(id: string, req: WorkflowTransitionRequest): Promise<WorkflowInstance>;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/workflow${path}`);
  if (!res.ok) throw new Error(`Workflow API error: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api/workflow${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Workflow API error: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

class WorkflowRepositoryImpl implements IWorkflowRepository {
  listInstances()                         { return apiGet<WorkflowInstance[]>('/'); }
  getInstance(id: string)                 { return apiGet<WorkflowInstance>(`/${id}`); }
  listDefinitions()                       { return apiGet<WorkflowDefinition[]>('/definitions'); }
  getAvailableTransitions(id: string)     { return apiGet<string[]>(`/${id}/transitions`); }
  start(req: StartWorkflowRequest)        { return apiPost<WorkflowInstance>('/start', req); }
  transition(id: string, req: WorkflowTransitionRequest) {
    return apiPost<WorkflowInstance>(`/${id}/transition`, req);
  }
}

export const workflowRepository: IWorkflowRepository = new WorkflowRepositoryImpl();
