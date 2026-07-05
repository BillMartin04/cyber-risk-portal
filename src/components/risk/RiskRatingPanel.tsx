import type { Risk, RiskLevel } from '../../models';
import { getRiskColor } from '../shared/RiskRing';

interface Props {
  risk: Risk;
}

const LEVEL_SCORE: Record<RiskLevel, number> = {
  critical: 100, high: 75, medium: 50, low: 25,
};

function RatingBar({ label, level }: { label: string; level: RiskLevel }) {
  const score = LEVEL_SCORE[level];
  const color = getRiskColor(score);
  return (
    <div className="rating-bar-row">
      <div className="rating-bar-label">{label}</div>
      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="rating-bar-score" style={{ color, textTransform: 'capitalize' }}>{level}</span>
    </div>
  );
}

function ScoreCard({ label, score, note }: { label: string; score: number; note?: string }) {
  const color = getRiskColor(score);
  return (
    <div className="score-card" style={{ borderColor: `${color}30` }}>
      <div className="score-card-label">{label}</div>
      <div className="score-card-value" style={{ color, fontFamily: 'JetBrains Mono' }}>
        {score}
        <span style={{ fontSize: 14, color: 'var(--text-3)', fontFamily: 'inherit' }}>/100</span>
      </div>
      {note && <div className="score-card-note">{note}</div>}
    </div>
  );
}

export default function RiskRatingPanel({ risk }: Props) {
  const reduction = risk.inherentScore - risk.residualScore;
  const reductionPct = risk.inherentScore > 0
    ? Math.round((reduction / risk.inherentScore) * 100)
    : 0;

  return (
    <div className="risk-rating-panel">
      <div className="panel-header">
        <div className="panel-title">Risk Rating Analysis</div>
      </div>

      <div className="risk-rating-body">
        <div className="score-cards">
          <ScoreCard label="Inherent Risk"  score={risk.inherentScore} note="Pre-control exposure" />
          <div className="score-arrow">
            <div className="reduction-badge">
              ↓ {reductionPct}%
              <span style={{ fontSize: 10, display: 'block', fontWeight: 400, color: 'var(--text-3)' }}>
                control reduction
              </span>
            </div>
          </div>
          <ScoreCard label="Residual Risk" score={risk.residualScore} note="Post-control exposure" />
        </div>

        <div className="rating-dimensions">
          <div className="rating-dim-title">Risk Dimensions</div>
          <RatingBar label="Likelihood" level={risk.likelihood} />
          <RatingBar label="Impact"     level={risk.impact} />
        </div>

        {risk.regulatoryRefs.length > 0 && (
          <div className="regulatory-refs">
            <div className="rating-dim-title">Regulatory References</div>
            <div className="reg-tags">
              {risk.regulatoryRefs.map(ref => (
                <span key={ref} className="reg-tag">{ref}</span>
              ))}
            </div>
          </div>
        )}

        {risk.businessImpact && (
          <div style={{
            background: 'rgba(255,119,48,0.05)',
            border: '1px solid rgba(255,119,48,0.15)',
            borderRadius: 8, padding: 14,
          }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--high)', fontWeight: 600, marginBottom: 6 }}>
              Business Impact
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
              {risk.businessImpact}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
