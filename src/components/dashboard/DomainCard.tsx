import { useNavigate } from 'react-router-dom';
import {
  Shield, Database, Monitor, Code, Network,
  Building, Cloud, Users, Cpu, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { Domain } from '../../models';
import { DomainService } from '../../services/DomainService';
import RiskRing from '../shared/RiskRing';
import TrendIcon from '../shared/TrendIcon';

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Database, Monitor, Code, Network, Building, Cloud, Users, Cpu,
};

const MAX_PER_LEVEL = 3;

interface Props {
  domain: Domain;
}

export default function DomainCard({ domain }: Props) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[domain.iconName] ?? Shield;
  const counts = DomainService.getRiskCounts(domain);

  return (
    <div
      className="domain-card"
      onClick={() => navigate(`/domain/${domain.id}`)}
    >
      <style>{`.domain-card[data-id="${domain.id}"]:hover::before { background: ${domain.color}; }`}</style>

      <div className="domain-card-header">
        <div>
          <div
            className="domain-icon-wrap"
            style={{ background: `${domain.color}18`, border: `1px solid ${domain.color}30` }}
          >
            <Icon size={18} color={domain.color} strokeWidth={1.8} />
          </div>
          <div className="domain-card-name">{domain.name}</div>
          <div className="domain-card-owner">{domain.owner}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <TrendIcon trend={domain.trend} size={12} />
          <ArrowRight size={13} color="var(--text-3)" />
        </div>
      </div>

      <div className="domain-card-body">
        <RiskRing score={domain.riskScore} size={80} />
        <div className="risk-mini-bars">
          {([
            { key: 'critical', label: 'C', count: counts.critical, color: 'var(--critical)' },
            { key: 'high',     label: 'H', count: counts.high,     color: 'var(--high)' },
            { key: 'medium',   label: 'M', count: counts.medium,   color: 'var(--medium)' },
            { key: 'low',      label: 'L', count: counts.low,      color: 'var(--low)' },
          ] as const).map(({ key, label, count, color }) => (
            <div key={key} className="risk-mini-bar-row">
              <span className="risk-mini-bar-label" style={{ color }}>{label}</span>
              <div className="risk-mini-bar-track">
                <div className="risk-mini-bar-fill"
                  style={{ width: `${(count / MAX_PER_LEVEL) * 100}%`, background: color }} />
              </div>
              <span className="risk-mini-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="domain-card-footer">
        <div className="domain-footer-meta">
          <span className="domain-footer-label">Assessed</span>
          <span className="domain-footer-value">
            {new Date(domain.lastAssessed).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        </div>
        <div className="domain-footer-meta" style={{ textAlign: 'right' }}>
          <span className="domain-footer-label">Risks</span>
          <span className="domain-footer-value">{domain.risks.length} tracked</span>
        </div>
      </div>
    </div>
  );
}
