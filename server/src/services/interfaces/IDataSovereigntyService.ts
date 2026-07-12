import type { DataSovereigntyEntry, DataSovereigntyStats } from '../../models';

export interface IDataSovereigntyService {
  getAll(): DataSovereigntyEntry[];
  getById(id: string): DataSovereigntyEntry | undefined;
  getByRegion(region: string): DataSovereigntyEntry[];
  getStats(): DataSovereigntyStats;
}
