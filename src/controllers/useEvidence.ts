import { useMemo } from 'react';
import type { EvidenceArtifact, AuditTrailEntry, AttestationRecord, EvidenceStats } from '../models';
import { EvidenceService } from '../services/EvidenceService';

export interface EvidenceViewModel {
  artifacts:    EvidenceArtifact[];
  trail:        AuditTrailEntry[];
  attestations: AttestationRecord[];
  stats:        EvidenceStats;
}

export function useEvidence(): EvidenceViewModel {
  const artifacts    = useMemo(() => EvidenceService.getAllArtifacts(),  []);
  const trail        = useMemo(() => EvidenceService.getAuditTrail(),    []);
  const attestations = useMemo(() => EvidenceService.getAttestations(),  []);
  const stats        = useMemo(() => EvidenceService.getStats(),         []);
  return { artifacts, trail, attestations, stats };
}

export function useEvidenceForRisk(riskId: string): EvidenceArtifact[] {
  return useMemo(() => EvidenceService.getArtifactsByRiskId(riskId), [riskId]);
}
