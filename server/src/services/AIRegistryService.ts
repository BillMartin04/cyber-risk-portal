import type { IAIRegistryService } from './interfaces/IAIRegistryService';
import type { AIRegistryTool, AIRegistryStats } from '../models';
import type { IAIRegistryRepository } from '../repositories/AIRegistryRepository';
import { aiRegistryRepository } from '../repositories/AIRegistryRepository';

class AIRegistryServiceImpl implements IAIRegistryService {
  constructor(private readonly repo: IAIRegistryRepository) {}

  getAllTools(): AIRegistryTool[] {
    return this.repo.findAll();
  }

  getToolById(id: string): AIRegistryTool | undefined {
    return this.repo.findById(id);
  }

  getToolsByStatus(status: string): AIRegistryTool[] {
    return this.repo.findByStatus(status);
  }

  getStats(): AIRegistryStats {
    const tools = this.repo.findAll();
    return {
      total:             tools.length,
      approved:          tools.filter(t => t.status === 'approved').length,
      pending:           tools.filter(t => t.status === 'pending').length,
      prohibited:        tools.filter(t => t.status === 'prohibited').length,
      underReview:       tools.filter(t => t.status === 'under-review').length,
      totalMonthlyCost:  tools.reduce((s, t) => s + t.monthlyCost, 0),
      totalMonthlyUsers: tools.reduce((s, t) => s + t.monthlyUsers, 0),
    };
  }

  updateToolStatus(id: string, status: string, actor: string, note: string): AIRegistryTool | undefined {
    return this.repo.updateStatus(id, status, actor, note);
  }
}

export const AIRegistryService: IAIRegistryService = new AIRegistryServiceImpl(aiRegistryRepository);
