import { FileX2, AlertTriangle } from 'lucide-react';
import type { RiskException } from '../../models';
import RiskBadge from '../shared/RiskBadge';

interface Props {
  exceptions: RiskException[];
}

function StatusChip({ status }: { status: RiskException['status'] }) {
  const map = {
    'active':           { label: 'Active',          color: 'var(--cyan)'     },
    'expired':          { label: 'Expired',          color: 'var(--critical)' },
    'pending-renewal':  { label: 'Renewal Pending',  color: 'var(--medium)'   },
    'revoked':          { label: 'Revoked',          color: 'var(--text-3)'   },
  } as const;
  const { label, color } = map[status];
  return (
    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
      background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

export default function ExceptionRegister({ exceptions }: Props) {
  const daysUntil = (date: string) =>
    Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileX2 size={14} color="var(--medium)" />
          Exception Register
        </div>
        <span className="panel-count" style={{ background: 'var(--medium-10)', color: 'var(--medium)', borderColor: 'rgba(255,193,7,0.2)' }}>
          {exceptions.length} active
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Exception</th>
              <th>Domain</th>
              <th>Residual Risk</th>
              <th>Approver</th>
              <th>Status</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map(exc => {
              const days    = daysUntil(exc.expiryDate);
              const expiring = days <= 30;
              return (
                <tr key={exc.id}>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{exc.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--text-3)' }}>Control: </span>{exc.controlName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--cyan)', fontWeight: 600, marginRight: 4 }}>Compensating:</span>
                      {exc.compensatingControl}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{exc.domainName}</td>
                  <td><RiskBadge level={exc.residualRisk} /></td>
                  <td style={{ fontSize: 11, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{exc.approver}</td>
                  <td><StatusChip status={exc.status} /></td>
                  <td>
                    <div style={{ fontSize: 11, color: expiring ? 'var(--high)' : 'var(--text-3)', fontWeight: expiring ? 700 : 400 }}>
                      {new Date(exc.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {expiring && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--high)' }}>
                        <AlertTriangle size={10} />
                        {days}d remaining
                      </div>
                    )}
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
