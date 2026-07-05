import { AlertTriangle, Clock, User } from 'lucide-react';
import type { Issue } from '../../models';

interface Props {
  issues: Issue[];
}

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function SeverityDot({ severity }: { severity: Issue['severity'] }) {
  const color = severity === 'critical' ? 'var(--critical)'
              : severity === 'high'     ? 'var(--high)'
              : severity === 'medium'   ? 'var(--medium)'
              : 'var(--low)';
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />;
}

function StatusChip({ status }: { status: Issue['status'] }) {
  const styles: Record<string, { bg: string; color: string }> = {
    open:              { bg: 'var(--critical-10)',           color: 'var(--critical)' },
    'in-progress':     { bg: 'var(--medium-10)',             color: 'var(--medium)'   },
    'pending-review':  { bg: 'rgba(80,120,200,0.12)',        color: '#6896ff'         },
    closed:            { bg: 'var(--low-10)',                color: 'var(--low)'      },
  };
  const s = styles[status] ?? styles['open'];
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
      textTransform: 'capitalize', whiteSpace: 'nowrap', ...s,
    }}>
      {status.replace('-', ' ')}
    </span>
  );
}

export default function IssuesSection({ issues }: Props) {
  const sorted = [...issues].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
  );

  if (sorted.length === 0) {
    return (
      <div className="issues-section">
        <div className="panel-header"><div className="panel-title">Issues (0)</div></div>
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
          No open issues — all controls performing within threshold.
        </div>
      </div>
    );
  }

  return (
    <div className="issues-section">
      <div className="panel-header">
        <div className="panel-title">
          <AlertTriangle size={13} color="var(--high)" />
          Issues ({sorted.length})
        </div>
      </div>

      <div className="issues-list">
        {sorted.map(issue => (
          <div key={issue.id} className="issue-card">
            <div className="issue-card-top">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <SeverityDot severity={issue.severity} />
                <div>
                  <div className="issue-title">{issue.title}</div>
                  {issue.rootCause && (
                    <div className="issue-root-cause">{issue.rootCause}</div>
                  )}
                </div>
              </div>
              <StatusChip status={issue.status} />
            </div>

            <div className="issue-meta-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <User size={11} color="var(--text-3)" />
                {issue.owner}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={11} color="var(--text-3)" />
                Due {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {(issue.daysOverdue ?? 0) > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--critical)' }}>
                  {issue.daysOverdue}d overdue
                </span>
              )}
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 4,
                background: issue.severity === 'critical' ? 'var(--critical-10)'
                           : issue.severity === 'high'    ? 'rgba(255,120,60,0.12)'
                           : issue.severity === 'medium'  ? 'var(--medium-10)'
                           : 'var(--low-10)',
                color: issue.severity === 'critical' ? 'var(--critical)'
                     : issue.severity === 'high'    ? 'var(--high)'
                     : issue.severity === 'medium'  ? 'var(--medium)'
                     : 'var(--low)',
                textTransform: 'capitalize',
              }}>
                {issue.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
