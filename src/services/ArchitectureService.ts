import type { ArchitectureData } from '../models';
import { architectureRepository } from '../repositories/ArchitectureRepository';

export interface IArchitectureService {
  getData(): Promise<ArchitectureData>;
}

class ArchitectureServiceImpl implements IArchitectureService {
  async getData(): Promise<ArchitectureData> {
    return architectureRepository.fetchData();
  }
}

export const ArchitectureService: IArchitectureService = new ArchitectureServiceImpl();
