import type { EvidenceArtifact, AuditTrailEntry, AttestationRecord } from '../models';
import { EVIDENCE_ARTIFACTS, AUDIT_TRAIL, ATTESTATIONS } from '../data/evidenceData';

export interface IEvidenceRepository {
  getAllArtifacts():                EvidenceArtifact[];
  getArtifactsByRiskId(id: string): EvidenceArtifact[];
  getArtifactsByDomain(id: string): EvidenceArtifact[];
  getAuditTrail():                  AuditTrailEntry[];
  getAttestations():                AttestationRecord[];
}

class EvidenceRepositoryImpl implements IEvidenceRepository {
  getAllArtifacts()                    { return EVIDENCE_ARTIFACTS; }
  getArtifactsByRiskId(id: string)    { return EVIDENCE_ARTIFACTS.filter(a => a.riskIds.includes(id)); }
  getArtifactsByDomain(id: string)    { return EVIDENCE_ARTIFACTS.filter(a => a.domainIds.includes(id)); }
  getAuditTrail()                     { return AUDIT_TRAIL; }
  getAttestations()                   { return ATTESTATIONS; }
}

export const evidenceRepository: IEvidenceRepository = new EvidenceRepositoryImpl();
