import { AlertOctagon } from 'lucide-react';
import type { ShadowAIIncident } from '../../models';
import TrendIcon from '../shared/TrendIcon';

interface Props {
  incidents: ShadowAIIncident[];
}

export default function ShadowAIPanel({ incidents }: Props) {
  const total = incidents.reduce((s, i) => s + i.incidents, 0);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <AlertOctagon size={14} color="var(--high)" />
          Shadow AI Incidents
        </div>
        <span className="panel-count" style={{ background: 'var(--high-10)', color: 'var(--high)', borderColor: 'rgba(255,119,48,0.2)' }}>
          {total} total
        </span>
      </div>

      <div className="panel-body">
        {incidents.map(inc => {
          const color = inc.risk === 'critical' ? 'var(--critical)'
                      : inc.risk === 'high'     ? 'var(--high)'
                      : 'var(--medium)';
          const pct = (inc.incidents / total) * 100;
          return (
            <div key={inc.tool} className="kri-row">
              <div className="kri-header">
                <div className="kri-name">{inc.tool}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendIcon trend={inc.trend} size={12} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color }}>
                    {inc.incidents}
                  </span>
                </div>
              </div>
              <div className="kri-bar-track">
                <div className="kri-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}

        <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-3)', borderTop: '1px solid var(--border)', lineHeight: 1.6 }}>
          Detected via DLP policy alerts and proxy log analysis. Incidents represent unapproved use of public generative AI tools with business data.
        </div>
      </div>
    </div>
  );
}
