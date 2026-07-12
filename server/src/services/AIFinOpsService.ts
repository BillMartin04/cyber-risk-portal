import type { IAIFinOpsService } from './interfaces/IAIFinOpsService';
import type { AIFinOpsData, AIToolSpend, DepartmentSpend } from '../models';
import type { IAIFinOpsRepository } from '../repositories/AIFinOpsRepository';
import { aiFinOpsRepository } from '../repositories/AIFinOpsRepository';

class AIFinOpsServiceImpl implements IAIFinOpsService {
  constructor(private readonly repo: IAIFinOpsRepository) {}

  getData(): AIFinOpsData {
    return this.repo.getData();
  }

  getShadowTools(): AIToolSpend[] {
    return this.repo.getData().toolSpend.filter(t => t.status === 'shadow');
  }

  getDepartmentBreakdown(): DepartmentSpend[] {
    return this.repo.getData().departmentBreakdown;
  }
}

export const AIFinOpsService: IAIFinOpsService = new AIFinOpsServiceImpl(aiFinOpsRepository);
