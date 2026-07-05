import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import type { Risk } from '../../models';
import { getRiskColor } from '../shared/RiskRing';
import RiskBadge from '../shared/RiskBadge';
import TrendIcon from '../shared/TrendIcon';

interface Props {
  risks: Risk[];
  domainId: string;
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
            background: c.status === 'implemented'     ? 'var(--low)'
                      : c.status === 'partial'         ? 'var(--medium)'
                      : c.status === 'not-implemented' ? 'var(--critical)'
                      : 'var(--na)',
          }}
        />
      ))}
    </div>
  );
}

function ScoreCell({ score, level }: { score: number; level: string }) {
  return (
    <div className="risk-score-cell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RiskBadge level={level as never} />
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 12,
          color: getRiskColor(score),
        }}>
          {score}
        </span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill"
          style={{ width: `${score}%`, background: getRiskColor(score) }} />
      </div>
    </div>
  );
}

export default function RiskTable({ risks, domainId }: Props) {
  const navigate = useNavigate();

  return (
    <div className="risk-table-wrap">
      <div className="risk-table-header">
        <div className="risk-table-title">Risk Register — {risks.length} risks tracked</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Click a row to drill into risk details
        </span>
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
            {risks.map(risk => {
              const openIssues = risk.issues.filter(i => i.status !== 'closed').length;
              return (
                <tr
                  key={risk.id}
                  className="clickable"
                  onClick={() => navigate(`/domain/${domainId}/risk/${risk.id}`)}
                >
                  <td>
                    <div className="risk-name-cell">
                      <div className="risk-name">{risk.name}</div>
                      <div className="risk-owner">{risk.owner} · {risk.businessUnit}</div>
                    </div>
                  </td>
                  <td><ScoreCell score={risk.inherentScore} level={risk.inherentRisk} /></td>
                  <td><ScoreCell score={risk.residualScore} level={risk.residualRisk} /></td>
                  <td><ControlDots risk={risk} /></td>
                  <td>
                    <span className={`lifecycle-badge ${risk.lifecycle}`}>{risk.lifecycle}</span>
                  </td>
                  <td><TrendIcon trend={risk.trend} showLabel /></td>
                  <td>
                    {openIssues > 0 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--high)' }}>
                        <AlertTriangle size={11} />
                        {openIssues} open
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {new Date(risk.nextReview).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td><ArrowRight size={14} color="var(--text-3)" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
