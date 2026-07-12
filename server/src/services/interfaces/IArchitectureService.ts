import type { ArchitectureData, AIAgent, ModelProvenance, ContainmentBoundary } from '../../models';

export interface IArchitectureService {
  getData(): ArchitectureData;
  getAgents(): AIAgent[];
  getModels(): ModelProvenance[];
  getContainmentBoundaries(): ContainmentBoundary[];
}
