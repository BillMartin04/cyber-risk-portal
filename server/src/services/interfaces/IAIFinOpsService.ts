import type { AIFinOpsData, AIToolSpend, DepartmentSpend } from '../../models';

export interface IAIFinOpsService {
  getData(): AIFinOpsData;
  getShadowTools(): AIToolSpend[];
  getDepartmentBreakdown(): DepartmentSpend[];
}
