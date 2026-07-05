import { Brain, AlertTriangle, ShieldAlert, Clock, Activity } from 'lucide-react';
import type { AIGovernanceStats } from '../../models';

interface Props {
  stats: AIGovernanceStats;
}

export default function AIGovernanceBanner({ stats }: Props) {
  const mitigationRate = stats.owaspThreatsIdentified > 0
    ? Math.round((stats.owaspThreatsMitigated / stats.owaspThreatsIdentified) * 100)
    : 0;

  const kpis = [
    { label: 'Total AI Systems',        value: stats.totalModels,            color: 'var(--text)',     icon: Brain },
    { label: 'In Production',           value: stats.productionModels,       color: 'var(--cyan)',     icon: Activity },
    { label: 'Critical / High Risk',    value: `${stats.criticalRiskModels + stats.highRiskModels}`, color: 'var(--high)', icon: ShieldAlert },
    { label: 'Pending Approval',        value: stats.pendingApproval,        color: 'var(--medium)',   icon: Clock },
    { label: 'Open Issues',             value: stats.totalOpenIssues,        color: 'var(--critical)', icon: AlertTriangle },
    { label: 'Shadow AI Incidents',     value: stats.shadowAIIncidents,      color: 'var(--high)',     icon: AlertTriangle },
    { label: 'NIST RMF Coverage',       value: `${stats.avgNISTCoverage}%`,  color: 'var(--cyan)',     icon: Activity },
    { label: 'OWASP Threats Mitigated', value: `${mitigationRate}%`,         color: mitigationRate >= 70 ? 'var(--low)' : 'var(--medium)', icon: ShieldAlert },
  ];

  return (
    <div className="ai-banner">
      <div className="ai-banner-brand">
        <div className="ai-banner-icon">
          <Brain size={28} color="var(--purple)" strokeWidth={1.6} />
        </div>
        <div>
          <div className="ai-banner-title">AI Governance Registry</div>
          <div className="ai-banner-sub">
            NIST AI RMF · OWASP LLM Top 10 · EU AI Act · Your Organization · Q2 2026
          </div>
        </div>
      </div>

      <div className="ai-banner-kpis">
        {kpis.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="ai-kpi">
            <Icon size={13} color={color} />
            <div className="ai-kpi-value" style={{ color }}>{value}</div>
            <div className="ai-kpi-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
