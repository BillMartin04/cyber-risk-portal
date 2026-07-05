import { CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import type { GovernanceDecision, GovernanceCommittee } from '../../models';

interface Props {
  decisions: GovernanceDecision[];
  committees: GovernanceCommittee[];
}

function OutcomeIcon({ outcome }: { outcome: GovernanceDecision['outcome'] }) {
  if (outcome === 'approved')  return <CheckCircle2 size={14} color="var(--low)" />;
  if (outcome === 'rejected')  return <XCircle      size={14} color="var(--critical)" />;
  if (outcome === 'deferred')  return <Clock        size={14} color="var(--medium)" />;
  return <Eye size={14} color="var(--cyan)" />;
}

const OUTCOME_LABEL: Record<string, { label: string; color: string }> = {
  approved: { label: 'Approved',  color: 'var(--low)'      },
  rejected: { label: 'Rejected',  color: 'var(--critical)' },
  deferred: { label: 'Deferred',  color: 'var(--medium)'   },
  noted:    { label: 'Noted',     color: 'var(--cyan)'     },
};

export default function DecisionLog({ decisions, committees }: Props) {
  const sorted = [...decisions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Governance Decision Log</div>
        <span className="panel-count" style={{ background: 'var(--cyan-10)', color: 'var(--cyan)', borderColor: 'rgba(0,212,255,0.2)' }}>
          {decisions.filter(d => !d.closed).length} open
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sorted.map(dec => {
          const { label, color } = OUTCOME_LABEL[dec.outcome];
          const isOverdue = !dec.closed && dec.dueDate && new Date(dec.dueDate) < new Date();
          return (
            <div key={dec.id} className="decision-row">
              <div className="decision-row-top">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <OutcomeIcon outcome={dec.outcome} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                      {dec.title}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11, color: 'var(--text-3)' }}>
                      <span style={{ color: 'var(--text-2)' }}>{dec.committee}</span>
                      <span>{new Date(dec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>Owner: {dec.owner}</span>
                      {dec.dueDate && (
                        <span style={{ color: isOverdue ? 'var(--critical)' : 'var(--text-3)', fontWeight: isOverdue ? 700 : 400 }}>
                          Due: {new Date(dec.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {isOverdue && ' ⚠ OVERDUE'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                    background: `${color}15`, color, border: `1px solid ${color}30` }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                    background: dec.closed ? 'var(--low-10)' : 'var(--cyan-10)',
                    color: dec.closed ? 'var(--low)' : 'var(--cyan)' }}>
                    {dec.closed ? 'Closed' : 'Open'}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginTop: 8, paddingLeft: 24 }}>
                {dec.rationale}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Committee Schedule
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {committees.map(c => (
            <div key={c.id} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 14px', minWidth: 160,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{c.shortName}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{c.name}</div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                  Last: {new Date(c.lastMeeting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cyan)' }}>
                  Next: {new Date(c.nextMeeting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                {c.openActions > 0 && (
                  <div style={{ fontSize: 10, color: 'var(--medium)', fontWeight: 700 }}>
                    {c.openActions} open action{c.openActions !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
