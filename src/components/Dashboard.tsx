import { useNavigate } from 'react-router-dom';
import {
  Shield, Database, Monitor, Code, Network,
  Building, Cloud, Users, Cpu,
  TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle, Clock, AlertCircle,
  ArrowRight, Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Domain, TrendDirection } from '../types';
import { DOMAINS, getOverallStats, getTopKRIs, getActionItems, ASSESSED_BY } from '../data';

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Database, Monitor, Code, Network, Building, Cloud, Users, Cpu,
};

function RiskRing({ score, size = 90 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(score / 100, 1) * circumference;
  const color = score >= 75 ? 'var(--critical)'
    : score >= 55 ? 'var(--high)'
    : score >= 35 ? 'var(--medium)'
    : 'var(--low)';
  const label = score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 1,
      }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 8, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
    </div>
  );
}

function PostureRing({ score, size = 110 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(score / 100, 1) * circumference;
  const color = score >= 75 ? 'var(--critical)' : score >= 55 ? 'var(--high)' : score >= 35 ? 'var(--medium)' : 'var(--low)';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="posture-ring-text">
        <span className="posture-ring-score" style={{ color }}>{score}</span>
        <span className="posture-ring-label">/ 100</span>
      </div>
    </div>
  );
}

function TrendIcon({ trend, size = 14 }: { trend: TrendDirection; size?: number }) {
  if (trend === 'improving') return <TrendingUp size={size} />;
  if (trend === 'degrading') return <TrendingDown size={size} />;
  return <Minus size={size} />;
}

function DomainCard({ domain }: { domain: Domain }) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[domain.iconName] ?? Shield;
  const maxRisks = 3;
  const counts = {
    critical: domain.risks.filter(r => r.residualRisk === 'critical').length,
    high: domain.risks.filter(r => r.residualRisk === 'high').length,
    medium: domain.risks.filter(r => r.residualRisk === 'medium').length,
    low: domain.risks.filter(r => r.residualRisk === 'low').length,
  };

  return (
    <div
      className="domain-card"
      onClick={() => navigate(`/domain/${domain.id}`)}
      style={{ '--card-accent': domain.color } as React.CSSProperties}
    >
      <style>{`.domain-card:hover::before { background: ${domain.color}; }`}</style>
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
          <span className={`trend ${domain.trend}`}>
            <TrendIcon trend={domain.trend} size={12} />
          </span>
          <ArrowRight size={13} color="var(--text-3)" />
        </div>
      </div>

      <div className="domain-card-body">
        <RiskRing score={domain.riskScore} size={80} />
        <div className="risk-mini-bars">
          {[
            { key: 'critical', label: 'C', count: counts.critical, color: 'var(--critical)' },
            { key: 'high',     label: 'H', count: counts.high,     color: 'var(--high)' },
            { key: 'medium',   label: 'M', count: counts.medium,   color: 'var(--medium)' },
            { key: 'low',      label: 'L', count: counts.low,      color: 'var(--low)' },
          ].map(({ key, label, count, color }) => (
            <div key={key} className="risk-mini-bar-row">
              <span className="risk-mini-bar-label" style={{ color }}>{label}</span>
              <div className="risk-mini-bar-track">
                <div className="risk-mini-bar-fill" style={{ width: `${(count / maxRisks) * 100}%`, background: color }} />
              </div>
              <span className="risk-mini-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="domain-card-footer">
        <div className="domain-footer-meta">
          <span className="domain-footer-label">Assessed</span>
          <span className="domain-footer-value">{new Date(domain.lastAssessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="domain-footer-meta" style={{ textAlign: 'right' }}>
          <span className="domain-footer-label">Risks</span>
          <span className="domain-footer-value">{domain.risks.length} tracked</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = getOverallStats();
  const topKRIs = getTopKRIs();
  const actionItems = getActionItems();
  const attestPct = Math.round((stats.implementedControls / stats.totalControls) * 100);
  const overallLabel = stats.overallScore >= 75 ? 'CRITICAL' : stats.overallScore >= 55 ? 'HIGH' : stats.overallScore >= 35 ? 'MEDIUM' : 'LOW';
  const overallColor = stats.overallScore >= 75 ? 'var(--critical)' : stats.overallScore >= 55 ? 'var(--high)' : stats.overallScore >= 35 ? 'var(--medium)' : 'var(--low)';

  return (
    <div className="dashboard">
      {/* Posture Banner */}
      <div className="posture-banner">
        <div className="posture-score-wrap">
          <PostureRing score={stats.overallScore} />
          <div className="posture-info">
            <div className="posture-title">
              Overall Risk Score: <span style={{ color: overallColor }}>{overallLabel}</span>
            </div>
            <div className="posture-sub">{ASSESSED_BY} · {DOMAINS.length} cyber risk domains</div>
            <div className="posture-badges">
              <span className="maturity-badge">
                <Zap size={11} />
                Maturity: Optimized
              </span>
              <span className="risk-badge high">
                <TrendingDown size={10} />
                Trend Stable
              </span>
            </div>
          </div>
        </div>

        <div className="posture-stats">
          <div className="posture-stat">
            <span className="posture-stat-value val-neutral">{stats.totalRisks}</span>
            <span className="posture-stat-label">Total Risks</span>
          </div>
          <div className="posture-stat">
            <span className="posture-stat-value val-critical">{stats.critical}</span>
            <span className="posture-stat-label">Critical</span>
          </div>
          <div className="posture-stat">
            <span className="posture-stat-value val-high">{stats.high}</span>
            <span className="posture-stat-label">High</span>
          </div>
          <div className="posture-stat">
            <span className="posture-stat-value val-warn">{stats.openIssues}</span>
            <span className="posture-stat-label">Open Issues</span>
          </div>
          <div className="posture-stat">
            <span className="posture-stat-value val-critical">{stats.overdueIssues}</span>
            <span className="posture-stat-label">Overdue</span>
          </div>
          <div className="posture-stat">
            <span className="posture-stat-value" style={{ color: attestPct >= 80 ? 'var(--low)' : 'var(--medium)' }}>{attestPct}%</span>
            <span className="posture-stat-label">Controls Attested</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Domain Cards */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={14} />
            Cyber Risk Domains — Click to drill down
          </div>
          <div className="domain-grid">
            {DOMAINS.map(domain => <DomainCard key={domain.id} domain={domain} />)}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Action Items */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <AlertTriangle size={14} color="var(--critical)" />
                My Action Items
              </div>
              <span className="panel-count">{actionItems.length}</span>
            </div>
            <div className="panel-body">
              {actionItems.map(item => (
                <div
                  key={item.id}
                  className="action-item"
                >
                  <div
                    className="action-item-dot"
                    style={{
                      background: item.severity === 'critical' ? 'var(--critical)'
                        : item.severity === 'high' ? 'var(--high)'
                        : item.severity === 'medium' ? 'var(--medium)'
                        : 'var(--low)',
                    }}
                  />
                  <div className="action-item-content">
                    <div className="action-item-title">{item.title}</div>
                    <div className="action-item-meta">
                      <span>{item.domainName}</span>
                      <span>·</span>
                      <span style={{ color: item.daysOverdue ? 'var(--critical)' : 'var(--text-3)' }}>
                        {item.daysOverdue ? (
                          <span className="overdue-tag">Overdue {item.daysOverdue}d</span>
                        ) : (
                          `Due ${new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top KRI Breaches */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <AlertCircle size={14} color="var(--medium)" />
                KRI Breach Summary
              </div>
              <span className="panel-count" style={{ background: 'var(--medium-10)', color: 'var(--medium)', borderColor: 'rgba(255,193,7,0.2)' }}>
                {topKRIs.length}
              </span>
            </div>
            <div className="panel-body">
              {topKRIs.map(kri => {
                const pct = Math.min((kri.value / (kri.threshold * 3)) * 100, 100);
                return (
                  <div key={kri.id} className="kri-row">
                    <div className="kri-header">
                      <div className="kri-name">{kri.name}</div>
                      <div className="kri-values">
                        <span className={`kri-val ${kri.status}`}>
                          {kri.value}{kri.unit}
                        </span>
                        <span className="kri-threshold">/ {kri.threshold}{kri.unit}</span>
                      </div>
                    </div>
                    <div className="kri-bar-track">
                      <div
                        className="kri-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: kri.status === 'breach' ? 'var(--critical)' : 'var(--medium)',
                        }}
                      />
                    </div>
                    <div className="kri-domain" style={{ color: kri.domainColor }}>{kri.domainName}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <CheckCircle size={14} color="var(--low)" />
                Control Status
              </div>
            </div>
            <div className="panel-body" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Implemented', count: stats.implementedControls, total: stats.totalControls, color: 'var(--low)' },
                { label: 'Partial', count: stats.partialControls, total: stats.totalControls, color: 'var(--medium)' },
                { label: 'Not Implemented', count: stats.totalControls - stats.implementedControls - stats.partialControls, total: stats.totalControls, color: 'var(--critical)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)' }}>
                    <span>{item.label}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', color: item.color, fontWeight: 700 }}>
                      {item.count}/{item.total}
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(item.count / item.total) * 100}%`,
                      background: item.color,
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: 'var(--text-3)' }}>
                <Clock size={11} />
                Next annual review: Q3 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
