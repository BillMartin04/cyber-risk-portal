import { FileText, AlertTriangle } from 'lucide-react';
import type { PolicyRecord } from '../../models';

interface Props {
  policies: PolicyRecord[];
}

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  current:      { label: 'Current',       color: 'var(--low)'      },
  'under-review':{ label: 'Under Review', color: 'var(--cyan)'     },
  overdue:      { label: 'Overdue',       color: 'var(--critical)' },
  draft:        { label: 'Draft',         color: 'var(--text-3)'   },
};

export default function PolicyRegister({ policies }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileText size={14} color="var(--text-2)" />
          Policy Register
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {policies.filter(p => p.status === 'overdue').length} overdue
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Policy</th>
              <th>Owner</th>
              <th>Version</th>
              <th>Status</th>
              <th>Last Reviewed</th>
              <th>Next Review</th>
              <th>Reg. Framework</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(policy => {
              const { label, color } = STATUS_STYLE[policy.status] ?? STATUS_STYLE['current'];
              return (
                <tr key={policy.id}>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {policy.status === 'overdue' && (
                        <AlertTriangle size={11} color="var(--critical)" style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      )}
                      {policy.name}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{policy.owner}</td>
                  <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>v{policy.version}</td>
                  <td>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                      background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {label}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {new Date(policy.lastReviewed).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontSize: 11, color: policy.status === 'overdue' ? 'var(--critical)' : 'var(--text-3)', fontWeight: policy.status === 'overdue' ? 700 : 400 }}>
                    {new Date(policy.nextReview).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {policy.regulatoryRef.map(r => (
                        <span key={r} className="reg-tag" style={{ fontSize: 9 }}>{r}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
