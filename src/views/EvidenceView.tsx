import { useEvidence } from '../controllers/useEvidence';
import EvidenceBanner from '../components/evidence/EvidenceBanner';
import EvidenceRegistryTable from '../components/evidence/EvidenceRegistryTable';
import AuditTimeline from '../components/evidence/AuditTimeline';
import AttestationTracker from '../components/evidence/AttestationTracker';

export default function EvidenceView() {
  const { artifacts, trail, attestations, stats } = useEvidence();

  return (
    <div className="evidence-view">
      <EvidenceBanner stats={stats} />

      <div className="evidence-body">
        <div className="evidence-main">
          <EvidenceRegistryTable artifacts={artifacts} />
          <AuditTimeline trail={trail} />
        </div>

        <div className="evidence-side">
          <AttestationTracker attestations={attestations} />
        </div>
      </div>
    </div>
  );
}
