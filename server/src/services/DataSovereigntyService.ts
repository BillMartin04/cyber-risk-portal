import type { IDataSovereigntyService } from './interfaces/IDataSovereigntyService';
import type { DataSovereigntyEntry, DataSovereigntyStats } from '../models';
import type { IDataSovereigntyRepository } from '../repositories/DataSovereigntyRepository';
import { dataSovereigntyRepository } from '../repositories/DataSovereigntyRepository';

class DataSovereigntyServiceImpl implements IDataSovereigntyService {
  constructor(private readonly repo: IDataSovereigntyRepository) {}

  getAll(): DataSovereigntyEntry[]                       { return this.repo.findAll(); }
  getById(id: string): DataSovereigntyEntry | undefined  { return this.repo.findById(id); }
  getByRegion(region: string): DataSovereigntyEntry[]    { return this.repo.findByRegion(region); }

  getStats(): DataSovereigntyStats {
    const entries = this.repo.findAll();
    return {
      total:            entries.length,
      criticalRisk:     entries.filter(e => e.sovereigntyRisk === 'critical').length,
      highRisk:         entries.filter(e => e.sovereigntyRisk === 'high').length,
      crossBorderCount: entries.filter(e => e.crossBorderTransfer).length,
      gdprCompliant:    entries.filter(e => ['compliant', 'adequate'].includes(e.compliance.gdpr)).length,
      unknownResidency: entries.filter(e => e.region === 'unknown').length,
    };
  }
}

export const DataSovereigntyService: IDataSovereigntyService =
  new DataSovereigntyServiceImpl(dataSovereigntyRepository);
