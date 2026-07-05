interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function getRiskColor(score: number): string {
  if (score >= 75) return 'var(--critical)';
  if (score >= 55) return 'var(--high)';
  if (score >= 35) return 'var(--medium)';
  return 'var(--low)';
}

export function getRiskLabel(score: number): string {
  if (score >= 75) return 'CRITICAL';
  if (score >= 55) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

export default function RiskRing({ score, size = 90, strokeWidth = 8 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(score / 100, 1) * circumference;
  const color = getRiskColor(score);
  const label = getRiskLabel(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
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
        <span style={{
          fontSize: size / 4.5,
          fontWeight: 800,
          color,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontSize: size / 11,
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}
