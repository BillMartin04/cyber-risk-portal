import { Radar } from 'lucide-react';
import type { DetectionCoverage } from '../../models';

interface Props { coverage: DetectionCoverage[]; }

export default function DetectionCoveragePanel({ coverage }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Radar size={14} color="var(--cyan)" />
          Detection Coverage by Domain
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>alerts · FP rate · gaps</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
        {coverage.map(d => {
          const color = d.coverage >= 85 ? 'var(--low)' : d.coverage >= 65 ? 'var(--medium)' : 'var(--critical)';
          return (
            <div key={d.domainId} style={{ background: 'var(--card)', padding: '14px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.domainColor, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{d.domainName}</span>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                  <span style={{ color: 'var(--text-3)' }}>{d.alertsLast30Days} alerts/30d</span>
                  <span style={{ color: d.falsePositiveRate > 20 ? 'var(--medium)' : 'var(--text-3)' }}>
                    {d.falsePositiveRate}% FP
                  </span>
                  <span style={{ color, fontWeight: 700 }}>{d.coverage}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: d.detectionGaps.length > 0 ? 8 : 0 }}>
                <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.coverage}%`, height: '100%', background: color, borderRadius: 3 }} />
                </div>
              </div>

              {d.detectionGaps.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {d.detectionGaps.map(gap => (
                    <div key={gap} style={{
                      fontSize: 11, color: 'var(--text-2)', paddingLeft: 10,
                      borderLeft: '2px solid rgba(255,193,7,0.3)',
                      lineHeight: 1.5,
                    }}>
                      <span style={{ color: 'var(--medium)', fontWeight: 600, marginRight: 5 }}>Gap:</span>
                      {gap}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
