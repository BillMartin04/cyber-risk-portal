import type {
  EvidenceArtifact, AuditTrailEntry, AttestationRecord, EvidenceStats,
} from '../../models';

export interface IEvidenceService {
  getAllArtifacts():                EvidenceArtifact[];
  getArtifactsByRiskId(id: string): EvidenceArtifact[];
  getArtifactsByDomain(id: string): EvidenceArtifact[];
  getAuditTrail():                  AuditTrailEntry[];
  getAttestations():                AttestationRecord[];
  getStats():                       EvidenceStats;
}
