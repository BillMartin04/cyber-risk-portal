import type { IArchitectureService } from './interfaces/IArchitectureService';
import type { ArchitectureData, AIAgent, ModelProvenance, ContainmentBoundary } from '../models';
import type { IArchitectureRepository } from '../repositories/ArchitectureRepository';
import { architectureRepository } from '../repositories/ArchitectureRepository';

class ArchitectureServiceImpl implements IArchitectureService {
  constructor(private readonly repo: IArchitectureRepository) {}

  getData():                  ArchitectureData      { return this.repo.getData(); }
  getAgents():                AIAgent[]             { return this.repo.getData().agents; }
  getModels():                ModelProvenance[]     { return this.repo.getData().models; }
  getContainmentBoundaries(): ContainmentBoundary[] { return this.repo.getData().containmentBoundaries; }
}

export const ArchitectureService: IArchitectureService = new ArchitectureServiceImpl(architectureRepository);
