import {
  DataSovereigntyRepository,
  type DataSovereigntyEntry,
  type DataSovereigntyStats,
} from '../repositories/DataSovereigntyRepository';

export interface IDataSovereigntyService {
  fetchAll(): Promise<DataSovereigntyEntry[]>;
  fetchById(id: string): Promise<DataSovereigntyEntry>;
  fetchStats(): Promise<DataSovereigntyStats>;
}

class DataSovereigntyServiceImpl implements IDataSovereigntyService {
  fetchAll(): Promise<DataSovereigntyEntry[]>          { return DataSovereigntyRepository.getAll(); }
  fetchById(id: string): Promise<DataSovereigntyEntry> { return DataSovereigntyRepository.getById(id); }
  fetchStats(): Promise<DataSovereigntyStats>           { return DataSovereigntyRepository.getStats(); }
}

export const DataSovereigntyService: IDataSovereigntyService =
  new DataSovereigntyServiceImpl();
