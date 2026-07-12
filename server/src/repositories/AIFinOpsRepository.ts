import type { AIFinOpsData } from '../models';
import { aiFinOpsData } from '../data/aiFinOpsData';

export interface IAIFinOpsRepository {
  getData(): AIFinOpsData;
}

class AIFinOpsRepositoryImpl implements IAIFinOpsRepository {
  private readonly data: AIFinOpsData = aiFinOpsData;

  getData(): AIFinOpsData {
    return this.data;
  }
}

export const aiFinOpsRepository: IAIFinOpsRepository = new AIFinOpsRepositoryImpl();
