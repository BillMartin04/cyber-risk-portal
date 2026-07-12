import type { DataSovereigntyEntry } from '../models';
import { DATA_SOVEREIGNTY_ENTRIES } from '../data/dataSovereigntyData';

export interface IDataSovereigntyRepository {
  findAll(): DataSovereigntyEntry[];
  findById(id: string): DataSovereigntyEntry | undefined;
  findByRegion(region: string): DataSovereigntyEntry[];
  findByRisk(risk: string): DataSovereigntyEntry[];
}

class DataSovereigntyRepositoryImpl implements IDataSovereigntyRepository {
  constructor(private readonly entries: readonly DataSovereigntyEntry[]) {}
  findAll(): DataSovereigntyEntry[]                       { return [...this.entries]; }
  findById(id: string): DataSovereigntyEntry | undefined  { return this.entries.find(e => e.id === id); }
  findByRegion(region: string): DataSovereigntyEntry[]    { return this.entries.filter(e => e.region === region); }
  findByRisk(risk: string): DataSovereigntyEntry[]        { return this.entries.filter(e => e.sovereigntyRisk === risk); }
}

export const dataSovereigntyRepository: IDataSovereigntyRepository =
  new DataSovereigntyRepositoryImpl(DATA_SOVEREIGNTY_ENTRIES);
