import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { AttestationRecord } from '../../models';

interface Props { attestations: AttestationRecord[]; }

const STATUS_META = {
  complete: { label: 'Complete', color: 'var(--low)',      icon: CheckCircle2 },
  overdue:  { label: 'Overdue',  color: 'var(--critical)', icon: AlertCircle  },
  pending:  { label: 'Pending',  color: 'var(--medium)',   icon: Clock        },
};

export default function AttestationTracker({ attestations }: Props) {
  const complete = attestations.filter(a => a.status === 'complete').length;
  const overdue  = attestations.filter(a => a.status === 'overdue').length;
  const total    = attestations.length;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Domain Attestations — Q2 2026</div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
          <span style={{ color: 'var(--low)' }}>{complete} done</span>
          <span style={{ color: 'var(--critical)' }}>{overdue} overdue</span>
          <span style={{ color: 'var(--text-3)' }}>{total} total</span>
        </div>
      </div>

      <div style={{ padding: '8px 0' }}>
        {attestations.map(att => {
          const meta = STATUS_META[att.status];
          const Icon = meta.icon;
          return (
            <div key={att.id} style={{
              padding: '12px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} color={meta.color} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{att.domain}</span>
                </div>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 700,
                  color: meta.color, background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
                  {meta.label}
                </span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span>Attester: <strong style={{ color: 'var(--text-2)' }}>{att.attester}</strong></span>
                <span style={{ color: 'var(--text-3)' }}>{att.role}</span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span>
                  {att.status === 'complete'
                    ? <>Attested: <strong style={{ color: 'var(--low)', fontFamily: 'JetBrains Mono' }}>
                        {new Date(att.attestedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </strong></>
                    : <>Due: <strong style={{ color: meta.color, fontFamily: 'JetBrains Mono' }}>
                        {new Date(att.nextDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </strong></>}
                </span>
                <span>{att.riskCount} risks · {att.controlCount} controls</span>
                {att.exceptionsNoted > 0 && (
                  <span style={{ color: 'var(--medium)' }}>{att.exceptionsNoted} exception{att.exceptionsNoted !== 1 ? 's' : ''} noted</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
