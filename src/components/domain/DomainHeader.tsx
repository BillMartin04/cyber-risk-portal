import {
  Shield, Database, Monitor, Code, Network,
  Building, Cloud, Users, Cpu,
  type LucideIcon,
} from 'lucide-react';
import type { Domain } from '../../models';
import { DomainService } from '../../services/DomainService';
import RiskRing from '../shared/RiskRing';
import TrendIcon from '../shared/TrendIcon';

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Database, Monitor, Code, Network, Building, Cloud, Users, Cpu,
};

interface Props {
  domain: Domain;
  openIssueCount: number;
  notImplControlCount: number;
}

export default function DomainHeader({ domain, openIssueCount, notImplControlCount }: Props) {
  const Icon = ICON_MAP[domain.iconName] ?? Shield;

  return (
    <div className="domain-detail-header">
      <div
        className="domain-detail-icon"
        style={{ background: `${domain.color}15`, border: `1px solid ${domain.color}30` }}
      >
        <Icon size={28} color={domain.color} strokeWidth={1.7} />
      </div>

      <div className="domain-detail-info">
        <div className="domain-detail-title">{domain.name}</div>
        <div className="domain-detail-desc">{domain.description}</div>

        <div className="domain-detail-meta">
          {[
            { label: 'Domain Owner',              value: domain.owner },
            { label: 'Role',                       value: domain.ownerRole },
            { label: 'Last Assessed',              value: new Date(domain.lastAssessed).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
            { label: 'Maturity Level',             value: domain.maturityLevel, color: 'var(--cyan)' },
            { label: 'Open Issues',                value: String(openIssueCount), color: openIssueCount > 0 ? 'var(--high)' : 'var(--low)' },
            { label: 'Not Implemented Controls',   value: String(notImplControlCount), color: notImplControlCount > 0 ? 'var(--critical)' : 'var(--low)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="meta-item">
              <span className="meta-label">{label}</span>
              <span className="meta-value" style={color ? { color, textTransform: 'capitalize' } : undefined}>
                {value}
              </span>
            </div>
          ))}

          <div className="meta-item">
            <span className="meta-label">Trend</span>
            <TrendIcon trend={domain.trend} showLabel />
          </div>
        </div>
      </div>

      <div className="domain-detail-score">
        <RiskRing score={domain.riskScore} size={110} strokeWidth={10} />
        <div style={{ textAlign: 'center', marginTop: 6, fontSize: 11, color: 'var(--text-3)' }}>
          Risk Score
        </div>
      </div>
    </div>
  );
}
