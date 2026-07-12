import type { AIFinOpsData } from '../models';
import { aiFinOpsRepository } from '../repositories/AIFinOpsRepository';

export interface IAIFinOpsService {
  getData(): Promise<AIFinOpsData>;
}

class AIFinOpsServiceImpl implements IAIFinOpsService {
  async getData(): Promise<AIFinOpsData> {
    return aiFinOpsRepository.fetchData();
  }
}

export const AIFinOpsService: IAIFinOpsService = new AIFinOpsServiceImpl();
