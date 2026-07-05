import {
  Shield, Database, Monitor, Code, Network,
  Building, Cloud, Users, Cpu,
  type LucideIcon,
} from 'lucide-react';
import type { Domain, Risk } from '../../models';
import RiskBadge from '../shared/RiskBadge';
import TrendIcon from '../shared/TrendIcon';
import Breadcrumb from '../shared/Breadcrumb';

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Database, Monitor, Code, Network, Building, Cloud, Users, Cpu,
};

interface Props {
  domain: Domain;
  risk: Risk;
}

export default function RiskHeader({ domain, risk }: Props) {
  const DomainIcon = ICON_MAP[domain.iconName] ?? Shield;

  return (
    <div className="risk-detail-header">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: domain.name, to: `/domain/${domain.id}` },
        { label: risk.name },
      ]} />

      <div className="risk-detail-top">
        <div
          className="risk-detail-icon"
          style={{ background: `${domain.color}15`, border: `1px solid ${domain.color}30` }}
        >
          <DomainIcon size={24} color={domain.color} strokeWidth={1.7} />
        </div>

        <div className="risk-detail-info">
          <div className="risk-detail-title">{risk.name}</div>
          <div className="risk-detail-desc">{risk.description}</div>

          <div className="risk-detail-meta">
            {[
              { label: 'Risk ID',       value: risk.id.toUpperCase() },
              { label: 'Owner',         value: risk.owner },
              { label: 'Business Unit', value: risk.businessUnit },
              { label: 'Lifecycle',     value: risk.lifecycle, badge: true },
              { label: 'Last Assessed', value: new Date(risk.lastAssessed).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Next Review',   value: new Date(risk.nextReview).toLocaleDateString('en-US',   { month: 'long', day: 'numeric', year: 'numeric' }) },
            ].map(({ label, value, badge }) => (
              <div key={label} className="meta-item">
                <span className="meta-label">{label}</span>
                {badge ? (
                  <span className={`lifecycle-badge ${value}`}>{value}</span>
                ) : (
                  <span className="meta-value" style={{ textTransform: 'capitalize' }}>{value}</span>
                )}
              </div>
            ))}
            <div className="meta-item">
              <span className="meta-label">Trend</span>
              <TrendIcon trend={risk.trend} showLabel />
            </div>
          </div>
        </div>

        <div className="risk-detail-badges">
          <div className="risk-badge-block">
            <span className="risk-badge-label">Inherent Risk</span>
            <RiskBadge level={risk.inherentRisk} />
            <span className="risk-score-num">{risk.inherentScore}</span>
          </div>
          <div className="risk-badge-arrow">→</div>
          <div className="risk-badge-block">
            <span className="risk-badge-label">Residual Risk</span>
            <RiskBadge level={risk.residualRisk} />
            <span className="risk-score-num">{risk.residualScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
