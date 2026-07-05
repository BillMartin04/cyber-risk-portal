import { ShieldCheck, AlertTriangle, Clock, FileWarning, Users, CheckSquare } from 'lucide-react';
import type { GovernanceStats } from '../../models';

interface Props {
  stats: GovernanceStats;
}

export default function GovernanceBanner({ stats }: Props) {
  const kpis = [
    { label: 'Active Exceptions',    value: stats.activeExceptions,  color: stats.activeExceptions > 4 ? 'var(--high)' : 'var(--medium)', icon: FileWarning },
    { label: 'Expiring in 30 Days',  value: stats.expiringIn30Days,  color: stats.expiringIn30Days > 0 ? 'var(--high)' : 'var(--low)',    icon: Clock },
    { label: 'Open Decisions',       value: stats.openDecisions,     color: 'var(--cyan)',                                                 icon: CheckSquare },
    { label: 'Overdue Actions',      value: stats.overdueActions,    color: stats.overdueActions > 0 ? 'var(--critical)' : 'var(--low)',  icon: AlertTriangle },
    { label: 'Policies Overdue',     value: stats.policiesOverdue,   color: stats.policiesOverdue > 0 ? 'var(--medium)' : 'var(--low)',   icon: FileWarning },
    { label: 'Committees',           value: stats.committees,        color: 'var(--text)',                                                 icon: Users },
  ];

  return (
    <div className="gov-banner">
      <div className="gov-banner-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="gov-banner-icon">
            <ShieldCheck size={26} color="var(--low)" strokeWidth={1.6} />
          </div>
          <div>
            <div className="gov-banner-title">Governance & Risk Oversight</div>
            <div className="gov-banner-sub">
              NIST CSF 2.0 · Govern Function · Your Organization · Q2 2026
            </div>
          </div>
        </div>

        {stats.appetiteBreached && (
          <div className="appetite-breach-alert">
            <AlertTriangle size={14} color="var(--critical)" />
            Risk appetite breached —{' '}
            <strong>{stats.breachedLevels.join(', ').toUpperCase()}</strong> thresholds exceeded
          </div>
        )}
      </div>

      <div className="gov-kpi-row">
        {kpis.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="gov-kpi">
            <Icon size={13} color={color} />
            <div className="gov-kpi-value" style={{ color }}>{value}</div>
            <div className="gov-kpi-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
