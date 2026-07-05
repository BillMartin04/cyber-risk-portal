import { v4 as uuidv4 } from 'uuid';
import type { AgentAction, ApprovalQueueItem, ApprovalStatus, AgentTier } from './types';
import { QueueEngine } from '../queue/QueueEngine';

export interface IAgenticService {
  proposeAction(label: string, description: string, tier: AgentTier, payload: unknown): AgentAction;
  getApprovalQueue(): ApprovalQueueItem[];
  approve(id: string, decidedBy: string, note?: string): ApprovalQueueItem;
  reject(id: string, decidedBy: string, note?: string): ApprovalQueueItem;
  executeApproved(id: string): Promise<ApprovalQueueItem>;
}

class AgenticServiceImpl implements IAgenticService {
  private readonly queue = new Map<string, ApprovalQueueItem>();

  proposeAction(label: string, description: string, tier: AgentTier, payload: unknown): AgentAction {
    const action: AgentAction = {
      id:          uuidv4(),
      label,
      description,
      tier,
      payload,
      status:      'pending',
      createdAt:   new Date().toISOString(),
    };

    const item: ApprovalQueueItem = {
      id:          uuidv4(),
      action,
      requestedBy: 'AI Assist Panel',
      createdAt:   new Date().toISOString(),
      status:      'pending',
    };

    this.queue.set(item.id, item);
    return action;
  }

  getApprovalQueue(): ApprovalQueueItem[] {
    return Array.from(this.queue.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  approve(id: string, decidedBy: string, note?: string): ApprovalQueueItem {
    return this.decide(id, 'approved', decidedBy, note);
  }

  reject(id: string, decidedBy: string, note?: string): ApprovalQueueItem {
    return this.decide(id, 'rejected', decidedBy, note);
  }

  async executeApproved(id: string): Promise<ApprovalQueueItem> {
    const item = this.queue.get(id);
    if (!item)                      throw new Error(`Approval item '${id}' not found`);
    if (item.status !== 'approved') throw new Error(`Action '${id}' has not been approved`);
    if (item.action.tier === 'executor') {
      // Only executor-tier actions can be auto-dispatched to the queue
      const payload = item.action.payload as { jobType?: string; data?: unknown };
      QueueEngine.enqueue(payload.jobType ?? 'GENERIC', payload.data ?? {}, { priority: 'high' });
    }
    return item;
  }

  private decide(id: string, status: ApprovalStatus, decidedBy: string, note?: string): ApprovalQueueItem {
    const item = this.queue.get(id);
    if (!item) throw new Error(`Approval item '${id}' not found`);
    const updated: ApprovalQueueItem = {
      ...item,
      status,
      decidedBy,
      decidedAt: new Date().toISOString(),
      note,
      action: { ...item.action, status },
    };
    this.queue.set(id, updated);
    return updated;
  }
}

export const AgenticService: IAgenticService = new AgenticServiceImpl();
