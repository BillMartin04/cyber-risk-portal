import type { KRI } from '../../models';
import TrendIcon from '../shared/TrendIcon';

interface Props {
  kris: KRI[];
}

export default function KRISection({ kris }: Props) {
  return (
    <div className="kri-section" style={{ marginBottom: 20 }}>
      <div className="kri-section-header">Key Risk Indicators (KRIs)</div>
      <div className="kri-grid">
        {kris.map(kri => {
          const color = kri.status === 'breach'   ? 'var(--critical)'
                      : kri.status === 'at-risk'  ? 'var(--medium)'
                      : 'var(--low)';
          const pct = Math.min((kri.value / (kri.threshold * 2.5)) * 100, 100);
          const statusLabel = kri.status === 'breach' ? 'BREACH'
                            : kri.status === 'at-risk' ? 'AT RISK'
                            : 'WITHIN';

          return (
            <div key={kri.id} className="kri-card">
              <div className="kri-card-name">{kri.name}</div>

              <div className="kri-card-value" style={{ color }}>
                {kri.value}
                <span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 400 }}>
                  {kri.unit}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <div className="kri-bar-track" style={{ flex: 1, height: 5 }}>
                  <div className="kri-bar-fill"
                    style={{ width: `${pct}%`, background: color, height: '100%' }} />
                </div>
                <span className="kri-threshold">
                  Threshold: {kri.threshold}{kri.unit}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 10, padding: '1px 6px', borderRadius: 3, fontWeight: 600,
                  background: kri.status === 'breach'   ? 'var(--critical-10)'
                             : kri.status === 'at-risk' ? 'var(--medium-10)'
                             : 'var(--low-10)',
                  color,
                  border: `1px solid ${color}30`,
                }}>
                  {statusLabel}
                </span>
                <TrendIcon trend={kri.trend} size={11} showLabel />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
