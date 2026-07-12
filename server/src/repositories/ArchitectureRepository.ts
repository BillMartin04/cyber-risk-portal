import type { ArchitectureData } from '../models';
import { architectureData } from '../data/architectureData';

export interface IArchitectureRepository {
  getData(): ArchitectureData;
}

class ArchitectureRepositoryImpl implements IArchitectureRepository {
  private readonly data: ArchitectureData = architectureData;
  getData(): ArchitectureData { return this.data; }
}

export const architectureRepository: IArchitectureRepository = new ArchitectureRepositoryImpl();
