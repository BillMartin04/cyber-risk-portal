import type { EvidenceArtifact, AuditTrailEntry, AttestationRecord, EvidenceStats } from '../models';
import type { IEvidenceService } from './interfaces/IEvidenceService';
import type { IEvidenceRepository } from '../repositories/EvidenceRepository';
import { evidenceRepository } from '../repositories/EvidenceRepository';

class EvidenceServiceImpl implements IEvidenceService {
  constructor(private readonly repo: IEvidenceRepository) {}

  getAllArtifacts(): EvidenceArtifact[] {
    return this.repo.getAllArtifacts().sort(
      (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  getArtifactsByRiskId(id: string): EvidenceArtifact[] {
    return this.repo.getArtifactsByRiskId(id).sort(
      (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  getArtifactsByDomain(id: string): EvidenceArtifact[] {
    return this.repo.getArtifactsByDomain(id).sort(
      (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  getAuditTrail(): AuditTrailEntry[] {
    return this.repo.getAuditTrail().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getAttestations(): AttestationRecord[] {
    return this.repo.getAttestations();
  }

  getStats(): EvidenceStats {
    const artifacts    = this.repo.getAllArtifacts();
    const attestations = this.repo.getAttestations();
    return {
      totalArtifacts:        artifacts.length,
      currentArtifacts:      artifacts.filter(a => a.status === 'current').length,
      expiredArtifacts:      artifacts.filter(a => a.status === 'expired').length,
      pendingReview:         artifacts.filter(a => a.status === 'pending-review').length,
      attestationsComplete:  attestations.filter(a => a.status === 'complete').length,
      attestationsOverdue:   attestations.filter(a => a.status === 'overdue').length,
      auditFindings:         artifacts.filter(a => a.type === 'audit-finding').length,
      unsatisfactoryRatings: artifacts.filter(a => a.auditRating === 'unsatisfactory').length,
    };
  }
}

export const EvidenceService: IEvidenceService = new EvidenceServiceImpl(evidenceRepository);
