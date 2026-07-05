import { FileCheck, FileText, Shield, FileWarning, CheckCircle2 } from 'lucide-react';
import type { EvidenceArtifact, EvidenceType } from '../../models';
import { useEvidenceForRisk } from '../../controllers/useEvidence';

interface Props { riskId: string; }

const TYPE_ICON: Record<EvidenceType, typeof FileCheck> = {
  'test-result':        FileCheck,
  'attestation':        CheckCircle2,
  'assessment-report':  FileText,
  'exception-approval': Shield,
  'remediation-proof':  FileCheck,
  'audit-finding':      FileWarning,
};

const TYPE_COLOR: Record<EvidenceType, string> = {
  'test-result':        'var(--cyan)',
  'attestation':        'var(--low)',
  'assessment-report':  'var(--purple)',
  'exception-approval': 'var(--medium)',
  'remediation-proof':  '#06b6d4',
  'audit-finding':      'var(--high)',
};

export default function EvidenceTrailPanel({ riskId }: Props) {
  const artifacts = useEvidenceForRisk(riskId);

  if (artifacts.length === 0) {
    return (
      <div className="panel" style={{ padding: '20px' }}>
        <div className="panel-title" style={{ marginBottom: 12 }}>Evidence Trail</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
          No evidence artifacts linked to this risk.
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Evidence Trail</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{artifacts.length} artifact{artifacts.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {artifacts.map(art => {
          const Icon  = TYPE_ICON[art.type];
          const color = TYPE_COLOR[art.type];
          return (
            <div key={art.id} style={{
              padding: '14px 20px', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Icon size={14} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 4 }}>
                    {art.title}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10, color: 'var(--text-3)', marginBottom: 6 }}>
                    <span style={{ color, fontWeight: 600 }}>{art.type.replace(/-/g, ' ')}</span>
                    <span>·</span>
                    <span style={{ color: art.status === 'current' ? 'var(--low)' : art.status === 'expired' ? 'var(--critical)' : 'var(--medium)' }}>
                      {art.status}
                    </span>
                    <span>·</span>
                    <span>{new Date(art.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>
                    {art.outcome}
                  </div>
                  {art.regulatoryRef.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {art.regulatoryRef.slice(0, 3).map(r => (
                        <span key={r} style={{
                          fontSize: 9, padding: '1px 5px', borderRadius: 3,
                          background: 'var(--card-elevated)', color: 'var(--text-3)',
                          border: '1px solid var(--border)',
                        }}>{r.split(' ').slice(0, 3).join(' ')}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
