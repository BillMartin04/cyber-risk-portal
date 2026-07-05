import type { AIAssistRequest, AIAssistResponse, AIApprovalItem, AIStatus } from '../models';
import type { IAIAssistRepository } from '../repositories/AIAssistRepository';
import { aiAssistRepository } from '../repositories/AIAssistRepository';
import type { IAIAssistService } from './interfaces/IAIAssistService';

class AIAssistServiceImpl implements IAIAssistService {
  constructor(private readonly repo: IAIAssistRepository) {}

  getStatus()                            { return this.repo.getStatus(); }
  ask(req: AIAssistRequest)              { return this.repo.sendMessage(req); }
  getApprovalQueue()                     { return this.repo.getApprovalQueue(); }
  approveAction(id: string)              { return this.repo.approveItem(id); }
  rejectAction(id: string, reason: string) { return this.repo.rejectItem(id, reason); }
  executeAction(id: string)              { return this.repo.executeItem(id); }
}

export const AIAssistService: IAIAssistService = new AIAssistServiceImpl(aiAssistRepository);
