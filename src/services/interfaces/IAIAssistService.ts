import type {
  AIAssistRequest, AIAssistResponse, AIApprovalItem, AIStatus,
} from '../../models';

export interface IAIAssistService {
  getStatus(): Promise<AIStatus>;
  ask(req: AIAssistRequest): Promise<AIAssistResponse>;
  getApprovalQueue(): Promise<AIApprovalItem[]>;
  approveAction(id: string): Promise<AIApprovalItem>;
  rejectAction(id: string, reason: string): Promise<AIApprovalItem>;
  executeAction(id: string): Promise<AIApprovalItem>;
  resetAction(id: string): Promise<AIApprovalItem>;
}
