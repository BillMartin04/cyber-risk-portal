import type { AuditTrailEntry } from '../../models';

interface Props { trail: AuditTrailEntry[]; }

const OUTCOME_COLOR: Record<string, string> = {
  approved:  'var(--low)',
  updated:   'var(--cyan)',
  escalated: 'var(--high)',
  closed:    'var(--text-3)',
  created:   'var(--purple)',
  rejected:  'var(--critical)',
};

const OUTCOME_DOT: Record<string, string> = {
  approved:  'var(--low)',
  updated:   'var(--cyan)',
  escalated: 'var(--high)',
  closed:    'var(--text-3)',
  created:   'var(--purple)',
  rejected:  'var(--critical)',
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return 'recently';
}

export default function AuditTimeline({ trail }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Audit Trail (Recent Activity)</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{trail.length} events</span>
      </div>

      <div style={{ padding: '8px 20px 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {trail.map((entry, idx) => {
          const dotColor = OUTCOME_DOT[entry.outcome];
          const isLast   = idx === trail.length - 1;
          return (
            <div key={entry.id} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', background: dotColor,
                  boxShadow: `0 0 6px ${dotColor}60`, flexShrink: 0, marginTop: 6,
                }} />
                {!isLast && (
                  <div style={{ flex: 1, width: 1, background: 'var(--border)', minHeight: 24 }} />
                )}
              </div>

              <div style={{ paddingBottom: 16, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10, padding: '1px 7px', borderRadius: 3, fontWeight: 700,
                        color: OUTCOME_COLOR[entry.outcome],
                        background: `${OUTCOME_COLOR[entry.outcome]}15`,
                        border: `1px solid ${OUTCOME_COLOR[entry.outcome]}30`,
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                      }}>
                        {entry.outcome}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                        {entry.action}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      <strong style={{ color: 'var(--cyan)' }}>{entry.actor}</strong>
                      {' · '}
                      {entry.entity}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 5, lineHeight: 1.6 }}>
                      {entry.detail}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap', marginTop: 4 }}>
                    {timeAgo(entry.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
