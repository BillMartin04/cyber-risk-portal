import {
  AIRegistryRepository,
  type AIRegistryTool,
  type AIRegistryStats,
  type AIToolStatus,
} from '../repositories/AIRegistryRepository';

export interface IAIRegistryService {
  fetchAll(): Promise<AIRegistryTool[]>;
  fetchById(id: string): Promise<AIRegistryTool>;
  fetchStats(): Promise<AIRegistryStats>;
  changeStatus(id: string, status: AIToolStatus, actor: string, note: string): Promise<AIRegistryTool>;
}

class AIRegistryServiceImpl implements IAIRegistryService {
  fetchAll():                                                          Promise<AIRegistryTool[]> { return AIRegistryRepository.getAll(); }
  fetchById(id: string):                                               Promise<AIRegistryTool>   { return AIRegistryRepository.getById(id); }
  fetchStats():                                                        Promise<AIRegistryStats>   { return AIRegistryRepository.getStats(); }
  changeStatus(id: string, s: AIToolStatus, actor: string, note: string): Promise<AIRegistryTool> {
    return AIRegistryRepository.updateStatus(id, s, actor, note);
  }
}

export const AIRegistryService: IAIRegistryService = new AIRegistryServiceImpl();
