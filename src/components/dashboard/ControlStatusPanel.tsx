import { CheckCircle, Clock } from 'lucide-react';
import type { OverallStats } from '../../models';

interface Props {
  stats: OverallStats;
}

export default function ControlStatusPanel({ stats }: Props) {
  const notImpl = stats.totalControls - stats.implementedControls - stats.partialControls;

  const rows = [
    { label: 'Implemented',     count: stats.implementedControls, color: 'var(--low)' },
    { label: 'Partial',         count: stats.partialControls,     color: 'var(--medium)' },
    { label: 'Not Implemented', count: notImpl,                   color: 'var(--critical)' },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <CheckCircle size={14} color="var(--low)" />
          Control Status
        </div>
      </div>

      <div className="panel-body" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(({ label, count, color }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)' }}>
              <span>{label}</span>
              <span style={{ fontFamily: 'JetBrains Mono', color, fontWeight: 700 }}>
                {count}/{stats.totalControls}
              </span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(count / stats.totalControls) * 100}%`,
                background: color,
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
  );
}
