import type { AIRegistryTool } from '../models';
import { AI_REGISTRY_TOOLS } from '../data/aiRegistryData';

export interface IAIRegistryRepository {
  findAll(): AIRegistryTool[];
  findById(id: string): AIRegistryTool | undefined;
  findByStatus(status: string): AIRegistryTool[];
  updateStatus(id: string, status: string, actor: string, note: string): AIRegistryTool | undefined;
}

class AIRegistryRepositoryImpl implements IAIRegistryRepository {
  private tools: AIRegistryTool[];

  constructor(seed: AIRegistryTool[]) {
    this.tools = seed.map(t => ({ ...t }));
  }

  findAll(): AIRegistryTool[] { return [...this.tools]; }

  findById(id: string): AIRegistryTool | undefined {
    return this.tools.find(t => t.id === id);
  }

  findByStatus(status: string): AIRegistryTool[] {
    return this.tools.filter(t => t.status === status);
  }

  updateStatus(id: string, status: string, actor: string, note: string): AIRegistryTool | undefined {
    const tool = this.tools.find(t => t.id === id);
    if (!tool) return undefined;
    tool.status = status as AIRegistryTool['status'];
    tool.approvalHistory.push({
      date: new Date().toISOString().split('T')[0],
      action: status,
      actor,
      note,
    });
    if (status === 'approved') tool.approvedDate = new Date().toISOString().split('T')[0];
    return { ...tool };
  }
}

export const aiRegistryRepository: IAIRegistryRepository = new AIRegistryRepositoryImpl(
  AI_REGISTRY_TOOLS,
);
