import { useParams, Link } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, Clock,
  TrendingUp, TrendingDown, Minus, ArrowRight,
  FileText, AlertCircle, ExternalLink, User, Calendar,
} from 'lucide-react';
import type { Control, Issue, TrendDirection } from '../types';
import { getDomain, getRisk } from '../data';

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === 'improving') return <TrendingUp size={13} />;
  if (trend === 'degrading') return <TrendingDown size={13} />;
  return <Minus size={13} />;
}

function ScoreBlock({ score, label, sub }: { score: number; label: string; sub: string }) {
  const color = score >= 75 ? 'var(--critical)' : score >= 55 ? 'var(--high)' : score >= 35 ? 'var(--medium)' : 'var(--low)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      <div className="risk-rating-label">{label}</div>
      <div className="risk-rating-main">
        <span className="risk-rating-score" style={{ color }}>{score}</span>
        <div className="risk-rating-sub">
          <span className={`risk-badge ${sub.toLowerCase()}`}>{sub}</span>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlRow({ control }: { control: Control }) {
  const effectColor = control.effectiveness >= 75 ? 'var(--low)' : control.effectiveness >= 50 ? 'var(--medium)' : 'var(--critical)';

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{control.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{control.description}</div>
          {control.framework && <span className="framework-tag">{control.framework}</span>}
        </div>
      </td>
      <td>
        <span className={`control-type-badge ${control.type}`}>{control.type}</span>
      </td>
      <td>
        <span className={`control-badge ${control.status}`}>
          {control.status === 'implemented' ? '✓ Implemented'
            : control.status === 'partial' ? '⚠ Partial'
            : control.status === 'not-implemented' ? '✕ Not Implemented'
            : 'N/A'}
        </span>
      </td>
      <td>
        {control.status === 'not-implemented' ? (
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>—</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono', color: effectColor }}>
              {control.effectiveness}%
            </span>
            <div className="effectiveness-bar-track">
              <div className="effectiveness-bar-fill" style={{ width: `${control.effectiveness}%`, background: effectColor }} />
            </div>
          </div>
        )}
      </td>
      <td>
        <span className={`auto-badge ${control.automationLevel}`}>
          {control.automationLevel === 'automated' ? 'Auto'
            : control.automationLevel === 'semi-automated' ? 'Semi'
            : 'Manual'}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{control.owner}</div>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {control.lastAttested ? (
            <>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                Last: {new Date(control.lastAttested).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--cyan)' }}>
                Next: {new Date(control.nextAttestation).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--critical)' }}>Not attested</span>
          )}
        </div>
      </td>
      <td>
        <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'capitalize' }}>{control.frequency}</div>
      </td>
    </tr>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  const color = issue.severity === 'critical' ? 'var(--critical)'
    : issue.severity === 'high' ? 'var(--high)'
    : issue.severity === 'medium' ? 'var(--medium)'
    : 'var(--low)';

  return (
    <div className="issue-row">
      <div className="issue-icon-wrap" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <AlertTriangle size={15} color={color} />
      </div>
      <div className="issue-content">
        <div className="issue-title">{issue.title}</div>
        {issue.rootCause && (
          <div className="issue-root">
            <strong style={{ color: 'var(--text-3)' }}>Root cause: </strong>{issue.rootCause}
          </div>
        )}
        <div className="issue-meta">
          <span className={`risk-badge ${issue.severity}`}>{issue.severity}</span>
          <span className={`issue-status ${issue.status}`}>
            {issue.status.replace('-', ' ')}
          </span>
          <span className="issue-meta-item">
            <User size={10} />
            {issue.owner}
          </span>
          <span className="issue-meta-item">
            <Calendar size={10} />
            Due: {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {issue.daysOverdue && (
            <span className="issue-overdue">Overdue by {issue.daysOverdue} day{issue.daysOverdue > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RiskDetail() {
  const { domainId, riskId } = useParams<{ domainId: string; riskId: string }>();
  const domain = getDomain(domainId ?? '');
  const risk = getRisk(domainId ?? '', riskId ?? '');

  if (!domain || !risk) {
    return (
      <div style={{ color: 'var(--text-2)', padding: 40, textAlign: 'center' }}>
        Risk not found. <Link to="/" style={{ color: 'var(--cyan)' }}>Return to dashboard</Link>
      </div>
    );
  }

  const openIssues = risk.issues.filter(i => i.status !== 'closed');
  const reduction = risk.inherentScore - risk.residualScore;
  const implementedCount = risk.controls.filter(c => c.status === 'implemented').length;
  const partialCount = risk.controls.filter(c => c.status === 'partial').length;
  const notImplCount = risk.controls.filter(c => c.status === 'not-implemented').length;
  const avgEffectiveness = risk.controls.length > 0
    ? Math.round(risk.controls.reduce((s, c) => s + c.effectiveness, 0) / risk.controls.length)
    : 0;

  return (
    <div className="risk-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to={`/domain/${domain.id}`} className="breadcrumb-item">{domain.name}</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{risk.name}</span>
      </div>

      {/* Risk Header */}
      <div className="risk-detail-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8, flexShrink: 0,
            background: 'var(--high-10)', border: '1px solid rgba(255,119,48,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={20} color="var(--high)" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className={`lifecycle-badge ${risk.lifecycle}`}>{risk.lifecycle}</span>
              <span className={`trend ${risk.trend}`}>
                <TrendIcon trend={risk.trend} />
                <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{risk.trend}</span>
              </span>
            </div>
            <div className="risk-detail-title">{risk.name}</div>
          </div>
        </div>

        <div className="risk-detail-desc">{risk.description}</div>

        <div className="business-impact-box">
          <div className="business-impact-label">Business Impact</div>
          <div className="business-impact-text">{risk.businessImpact}</div>
        </div>

        <div className="risk-detail-meta">
          <div className="meta-item">
            <span className="meta-label">Risk Owner</span>
            <span className="meta-value">{risk.owner}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Business Unit</span>
            <span className="meta-value">{risk.businessUnit}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Likelihood</span>
            <span className={`risk-badge ${risk.likelihood}`}>{risk.likelihood}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Impact</span>
            <span className={`risk-badge ${risk.impact}`}>{risk.impact}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Last Assessed</span>
            <span className="meta-value">{new Date(risk.lastAssessed).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Next Review</span>
            <span className="meta-value" style={{ color: 'var(--cyan)' }}>{new Date(risk.nextReview).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {risk.regulatoryRefs.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              Regulatory References
            </div>
            <div className="reg-refs">
              {risk.regulatoryRefs.map(ref => <span key={ref} className="reg-ref">{ref}</span>)}
            </div>
          </div>
        )}
      </div>

      {/* Inherent vs Residual */}
      <div className="risk-rating-grid">
        <ScoreBlock score={risk.inherentScore} label="Inherent Risk (Before Controls)" sub={risk.inherentRisk.charAt(0).toUpperCase() + risk.inherentRisk.slice(1)} />

        <div className="risk-rating-arrow">
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>Control Reduction</div>
          <div className="arrow-line">
            <ArrowRight size={16} />
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 16 }}>-{reduction}</span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: 'var(--text-3)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ color: 'var(--low)' }}>✓{implementedCount}</span>
              <span style={{ color: 'var(--medium)' }}>⚠{partialCount}</span>
              <span style={{ color: 'var(--critical)' }}>✕{notImplCount}</span>
            </div>
            <div>Avg effectiveness: <span style={{ color: avgEffectiveness >= 70 ? 'var(--low)' : 'var(--medium)', fontWeight: 700 }}>{avgEffectiveness}%</span></div>
          </div>
        </div>

        <ScoreBlock score={risk.residualScore} label="Residual Risk (After Controls)" sub={risk.residualRisk.charAt(0).toUpperCase() + risk.residualRisk.slice(1)} />
      </div>

      {/* Controls Table */}
      <div className="controls-section">
        <div className="section-header">
          <div className="section-title">
            <CheckCircle size={15} color="var(--cyan)" />
            Controls ({risk.controls.length})
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
            <span style={{ color: 'var(--low)' }}>✓ {implementedCount} Implemented</span>
            <span style={{ color: 'var(--medium)' }}>⚠ {partialCount} Partial</span>
            {notImplCount > 0 && <span style={{ color: 'var(--critical)' }}>✕ {notImplCount} Not Implemented</span>}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: 280 }}>Control Name & Description</th>
                <th>Type</th>
                <th>Status</th>
                <th>Effectiveness</th>
                <th>Automation</th>
                <th>Owner</th>
                <th>Attestation</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {risk.controls.map(control => <ControlRow key={control.id} control={control} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues */}
      <div className="issues-section">
        <div className="section-header">
          <div className="section-title">
            <AlertCircle size={15} color={openIssues.length > 0 ? 'var(--critical)' : 'var(--low)'} />
            Open Issues ({openIssues.length})
          </div>
          {openIssues.length > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              {openIssues.filter(i => i.daysOverdue).length} overdue
            </span>
          )}
        </div>
        {openIssues.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={28} className="empty-state-icon" />
            <div className="empty-state-text">No open issues — good standing</div>
          </div>
        ) : (
          openIssues.map(issue => <IssueRow key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
}
