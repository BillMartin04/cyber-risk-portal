import { API_BASE } from '../config/api';

export type SovereigntyRisk  = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type ComplianceStatus = 'compliant' | 'non-compliant' | 'adequate' | 'unknown';
export type DataRegion       = 'us' | 'eu' | 'uk' | 'apac' | 'cn' | 'unknown';

export interface DataSovereigntyCompliance {
  gdpr:   ComplianceStatus;
  ccpa:   ComplianceStatus;
  apra:   ComplianceStatus;
  ukGdpr: ComplianceStatus;
}

export interface DataSovereigntyEntry {
  id:                   string;
  toolId:               string;
  toolName:             string;
  vendor:               string;
  status:               string;
  dataResidency:        string;
  region:               DataRegion;
  processingRegions:    string[];
  crossBorderTransfer:  boolean;
  transferMechanisms:   string[];
  compliance:           DataSovereigntyCompliance;
  dataTypesProcessed:   string[];
  retentionPeriod:      string;
  encryptionInTransit:  boolean;
  encryptionAtRest:     boolean;
  thirdPartySharing:    boolean;
  sovereigntyRisk:      SovereigntyRisk;
  certifications:       string[];
  notes:                string;
}

export interface DataSovereigntyStats {
  total:            number;
  criticalRisk:     number;
  highRisk:         number;
  crossBorderCount: number;
  gdprCompliant:    number;
  unknownResidency: number;
}

export interface IDataSovereigntyRepository {
  getAll(): Promise<DataSovereigntyEntry[]>;
  getById(id: string): Promise<DataSovereigntyEntry>;
  getStats(): Promise<DataSovereigntyStats>;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/data-sovereignty${path}`);
  if (!res.ok) throw new Error(`Data Sovereignty API error ${res.status}`);
  const body = await res.json() as { data: T };
  return body.data;
}

class DataSovereigntyRepositoryImpl implements IDataSovereigntyRepository {
  getAll(): Promise<DataSovereigntyEntry[]>          { return apiGet('/'); }
  getById(id: string): Promise<DataSovereigntyEntry> { return apiGet(`/${id}`); }
  getStats(): Promise<DataSovereigntyStats>           { return apiGet('/stats'); }
}

export const DataSovereigntyRepository: IDataSovereigntyRepository =
  new DataSovereigntyRepositoryImpl();
