import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield, Database, Monitor, Code, Network,
  Building, Cloud, Users, Cpu,
  TrendingUp, TrendingDown, Minus,
  AlertTriangle, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { Risk, TrendDirection } from '../types';
import { getDomain } from '../data';

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Database, Monitor, Code, Network, Building, Cloud, Users, Cpu,
};

function ScoreRing({ score, size = 110 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(score / 100, 1) * circumference;
  const color = score >= 75 ? 'var(--critical)' : score >= 55 ? 'var(--high)' : score >= 35 ? 'var(--medium)' : 'var(--low)';
  const label = score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW';

  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
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
      <div className="score-ring-label">
        <span className="score-ring-number" style={{ color }}>{score}</span>
        <span className="score-ring-sub">{label}</span>
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === 'improving') return <TrendingUp size={13} />;
  if (trend === 'degrading') return <TrendingDown size={13} />;
  return <Minus size={13} />;
}

function ControlDots({ risk }: { risk: Risk }) {
  return (
    <div className="control-summary">
      {risk.controls.map(c => (
        <div
          key={c.id}
          className="control-dot"
          title={`${c.name} — ${c.status}`}
          style={{
            background: c.status === 'implemented' ? 'var(--low)'
              : c.status === 'partial' ? 'var(--medium)'
              : c.status === 'not-implemented' ? 'var(--critical)'
              : 'var(--na)',
          }}
        />
      ))}
    </div>
  );
}

function RiskRow({ risk, domainId }: { risk: Risk; domainId: string }) {
  const navigate = useNavigate();

  const scoreColor = (score: number) =>
    score >= 75 ? 'var(--critical)' : score >= 55 ? 'var(--high)' : score >= 35 ? 'var(--medium)' : 'var(--low)';

  return (
    <tr className="clickable" onClick={() => navigate(`/domain/${domainId}/risk/${risk.id}`)}>
      <td>
        <div className="risk-name-cell">
          <div className="risk-name">{risk.name}</div>
          <div className="risk-owner">{risk.owner} · {risk.businessUnit}</div>
        </div>
      </td>
      <td>
        <div className="risk-score-cell">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`risk-badge ${risk.inherentRisk}`}>{risk.inherentRisk}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: scoreColor(risk.inherentScore) }}>
              {risk.inherentScore}
            </span>
          </div>
          <div className="score-bar-track">
            <div className="score-bar-fill" style={{ width: `${risk.inherentScore}%`, background: scoreColor(risk.inherentScore) }} />
          </div>
        </div>
      </td>
      <td>
        <div className="risk-score-cell">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`risk-badge ${risk.residualRisk}`}>{risk.residualRisk}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: scoreColor(risk.residualScore) }}>
              {risk.residualScore}
            </span>
          </div>
          <div className="score-bar-track">
            <div className="score-bar-fill" style={{ width: `${risk.residualScore}%`, background: scoreColor(risk.residualScore) }} />
          </div>
        </div>
      </td>
      <td><ControlDots risk={risk} /></td>
      <td>
        <span className={`lifecycle-badge ${risk.lifecycle}`}>{risk.lifecycle}</span>
      </td>
      <td>
        <div className={`trend ${risk.trend}`}>
          <TrendIcon trend={risk.trend} />
          <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{risk.trend}</span>
        </div>
      </td>
      <td>
        {risk.issues.length > 0 ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: 'var(--high)',
          }}>
            <AlertTriangle size={11} />
            {risk.issues.filter(i => i.status !== 'closed').length} open
          </span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>—</span>
        )}
      </td>
      <td>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {new Date(risk.nextReview).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </td>
      <td>
        <ArrowRight size={14} color="var(--text-3)" />
      </td>
    </tr>
  );
}

export default function DomainDetail() {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const domain = getDomain(domainId ?? '');

  if (!domain) {
    return (
      <div style={{ color: 'var(--text-2)', padding: 40, textAlign: 'center' }}>
        Domain not found.{' '}
        <span style={{ color: 'var(--cyan)', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Return to dashboard
        </span>
      </div>
    );
  }

  const Icon = ICON_MAP[domain.iconName] ?? Shield;
  const allIssues = domain.risks.flatMap(r => r.issues.filter(i => i.status !== 'closed'));
  const notImplemented = domain.risks.flatMap(r => r.controls).filter(c => c.status === 'not-implemented').length;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{domain.name}</span>
      </div>

      {/* Domain Header */}
      <div className="domain-detail-header">
        <div className="domain-detail-icon" style={{ background: `${domain.color}15`, border: `1px solid ${domain.color}30` }}>
          <Icon size={28} color={domain.color} strokeWidth={1.7} />
        </div>

        <div className="domain-detail-info">
          <div className="domain-detail-title">{domain.name}</div>
          <div className="domain-detail-desc">{domain.description}</div>
          <div className="domain-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Domain Owner</span>
              <span className="meta-value">{domain.owner}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">{domain.ownerRole}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Assessed</span>
              <span className="meta-value">{new Date(domain.lastAssessed).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Maturity Level</span>
              <span className="meta-value" style={{ color: 'var(--cyan)', textTransform: 'capitalize' }}>{domain.maturityLevel}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Open Issues</span>
              <span className="meta-value" style={{ color: allIssues.length > 0 ? 'var(--high)' : 'var(--low)' }}>{allIssues.length}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Not Implemented Controls</span>
              <span className="meta-value" style={{ color: notImplemented > 0 ? 'var(--critical)' : 'var(--low)' }}>{notImplemented}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Trend</span>
              <span className={`trend ${domain.trend} meta-value`}>
                <TrendIcon trend={domain.trend} />
                <span style={{ textTransform: 'capitalize' }}>{domain.trend}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="domain-detail-score">
          <ScoreRing score={domain.riskScore} />
          <div style={{ textAlign: 'center', marginTop: 6, fontSize: 11, color: 'var(--text-3)' }}>Risk Score</div>
        </div>
      </div>

      {/* KRI Section */}
      <div className="kri-section" style={{ marginBottom: 20 }}>
        <div className="kri-section-header">Key Risk Indicators (KRIs)</div>
        <div className="kri-grid">
          {domain.kris.map(kri => {
            const color = kri.status === 'breach' ? 'var(--critical)' : kri.status === 'at-risk' ? 'var(--medium)' : 'var(--low)';
            const pct = Math.min((kri.value / (kri.threshold * 2.5)) * 100, 100);
            return (
              <div key={kri.id} className="kri-card">
                <div className="kri-card-name">{kri.name}</div>
                <div className="kri-card-value" style={{ color }}>
                  {kri.value}<span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 400 }}>{kri.unit}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <div className="kri-bar-track" style={{ flex: 1, height: 5 }}>
                    <div className="kri-bar-fill" style={{ width: `${pct}%`, background: color, height: '100%' }} />
                  </div>
                  <span className="kri-threshold">Threshold: {kri.threshold}{kri.unit}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: 10, padding: '1px 6px', borderRadius: 3, fontWeight: 600,
                    background: kri.status === 'breach' ? 'var(--critical-10)' : kri.status === 'at-risk' ? 'var(--medium-10)' : 'var(--low-10)',
                    color,
                    border: `1px solid ${color}30`,
                  }}>
                    {kri.status === 'breach' ? 'BREACH' : kri.status === 'at-risk' ? 'AT RISK' : 'WITHIN'}
                  </span>
                  <div className={`trend ${kri.trend}`} style={{ fontSize: 10 }}>
                    {kri.trend === 'improving' ? <TrendingUp size={11} /> : kri.trend === 'degrading' ? <TrendingDown size={11} /> : <Minus size={11} />}
                    <span style={{ textTransform: 'capitalize' }}>{kri.trend}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Table */}
      <div className="risk-table-wrap">
        <div className="risk-table-header">
          <div className="risk-table-title">
            Risk Register — {domain.risks.length} risks tracked
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Click a row to drill into risk details</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Risk Name</th>
                <th>Inherent Risk</th>
                <th>Residual Risk</th>
                <th>Controls</th>
                <th>Lifecycle</th>
                <th>Trend</th>
                <th>Issues</th>
                <th>Next Review</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {domain.risks.map(risk => (
                <RiskRow key={risk.id} risk={risk} domainId={domain.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
