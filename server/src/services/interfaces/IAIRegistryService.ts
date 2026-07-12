import type { AIRegistryTool, AIRegistryStats } from '../../models';

export interface IAIRegistryService {
  getAllTools(): AIRegistryTool[];
  getToolById(id: string): AIRegistryTool | undefined;
  getToolsByStatus(status: string): AIRegistryTool[];
  getStats(): AIRegistryStats;
  updateToolStatus(id: string, status: string, actor: string, note: string): AIRegistryTool | undefined;
}
