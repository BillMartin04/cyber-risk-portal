import { Zap, TrendingDown } from 'lucide-react';
import type { OverallStats } from '../../models';
import { getRiskColor, getRiskLabel } from '../shared/RiskRing';
import { ASSESSED_BY } from '../../data/cyberRiskData';

interface Props {
  stats: OverallStats;
  domainCount: number;
}

function PostureRing({ score }: { score: number }) {
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(score / 100, 1) * circumference;
  const color = getRiskColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div className="posture-ring-text">
        <span className="posture-ring-score" style={{ color }}>{score}</span>
        <span className="posture-ring-label">/ 100</span>
      </div>
    </div>
  );
}

export default function PostureBanner({ stats, domainCount }: Props) {
  const label = getRiskLabel(stats.overallScore);
  const color = getRiskColor(stats.overallScore);
  const attestPct = Math.round((stats.implementedControls / stats.totalControls) * 100);

  return (
    <div className="posture-banner">
      <div className="posture-score-wrap">
        <PostureRing score={stats.overallScore} />
        <div className="posture-info">
          <div className="posture-title">
            Overall Risk Score: <span style={{ color }}>{label}</span>
          </div>
          <div className="posture-sub">
            {ASSESSED_BY} · {domainCount} cyber risk domains
          </div>
          <div className="posture-badges">
            <span className="maturity-badge"><Zap size={11} /> Maturity: Optimized</span>
            <span className="risk-badge high"><TrendingDown size={10} /> Trend Stable</span>
          </div>
        </div>
      </div>

      <div className="posture-stats">
        {[
          { label: 'Total Risks',       value: stats.totalRisks,          cls: 'val-neutral' },
          { label: 'Critical',          value: stats.critical,            cls: 'val-critical' },
          { label: 'High',              value: stats.high,                cls: 'val-high' },
          { label: 'Open Issues',       value: stats.openIssues,          cls: 'val-warn' },
          { label: 'Overdue',           value: stats.overdueIssues,       cls: 'val-critical' },
          { label: 'Controls Attested', value: `${attestPct}%`,
            cls: attestPct >= 80 ? 'val-low' : 'val-warn' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="posture-stat">
            <span className={`posture-stat-value ${cls}`}>{value}</span>
            <span className="posture-stat-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
