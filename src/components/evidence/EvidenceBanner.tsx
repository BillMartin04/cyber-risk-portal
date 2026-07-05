import { FileCheck, AlertTriangle, Clock, CheckCircle2, Search, FileX } from 'lucide-react';
import type { EvidenceStats } from '../../models';

interface Props { stats: EvidenceStats; }

export default function EvidenceBanner({ stats }: Props) {
  const kpis = [
    { label: 'Total Artifacts',    value: stats.totalArtifacts,          color: 'var(--text)',     icon: FileCheck },
    { label: 'Current / Active',   value: stats.currentArtifacts,        color: 'var(--low)',      icon: CheckCircle2 },
    { label: 'Pending Review',     value: stats.pendingReview,           color: stats.pendingReview > 0 ? 'var(--medium)' : 'var(--text)', icon: Search },
    { label: 'Expired',            value: stats.expiredArtifacts,        color: stats.expiredArtifacts > 0 ? 'var(--high)' : 'var(--text)', icon: FileX },
    { label: 'Attestations Done',  value: `${stats.attestationsComplete}/${stats.attestationsComplete + stats.attestationsOverdue + 1}`, color: 'var(--low)', icon: CheckCircle2 },
    { label: 'Overdue Attestations', value: stats.attestationsOverdue,   color: stats.attestationsOverdue > 0 ? 'var(--critical)' : 'var(--low)', icon: AlertTriangle },
    { label: 'Audit Findings',     value: stats.auditFindings,           color: 'var(--medium)',   icon: Clock },
    { label: 'Unsatisfactory',     value: stats.unsatisfactoryRatings,   color: stats.unsatisfactoryRatings > 0 ? 'var(--critical)' : 'var(--low)', icon: AlertTriangle },
  ];

  return (
    <div className="ev-banner">
      <div className="ev-banner-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="ev-banner-icon">
            <FileCheck size={24} color="var(--cyan)" strokeWidth={1.6} />
          </div>
          <div>
            <div className="ev-banner-title">Evidence & Audit Traceability</div>
            <div className="ev-banner-sub">
              Artifacts · Attestations · Audit Trail · Your Organization · Q2 2026
            </div>
          </div>
        </div>
      </div>

      <div className="ev-kpi-row">
        {kpis.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="ev-kpi">
            <Icon size={12} color={color} />
            <div className="ev-kpi-value" style={{ color }}>{value}</div>
            <div className="ev-kpi-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
