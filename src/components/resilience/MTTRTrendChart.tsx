import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { MetricPoint, IncidentCategoryMetric } from '../../models';
import TrendIcon from '../shared/TrendIcon';

interface Props {
  trend:          MetricPoint[];
  categoryMetrics: IncidentCategoryMetric[];
}

const TARGETS = { mttd: 2, mttc: 4, mttr: 12 };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--card-elevated)', border: '1px solid var(--border-2)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 3 }}>
          {p.name}: <strong>{p.value}h</strong>
        </div>
      ))}
    </div>
  );
}

export default function MTTRTrendChart({ trend, categoryMetrics }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Detection & Response Trend (6 Quarters)</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>hours · lower is better · dashed = target</span>
      </div>

      <div style={{ padding: '20px 20px 8px' }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="quarter" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />

            <ReferenceLine y={TARGETS.mttd} stroke="#00d4ff" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={TARGETS.mttc} stroke="#ffc107" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={TARGETS.mttr} stroke="#a855f7" strokeDasharray="4 4" strokeOpacity={0.4} />

            <Line type="monotone" dataKey="mttd" name="MTTD" stroke="#00d4ff" strokeWidth={2} dot={{ r: 3, fill: '#00d4ff' }} />
            <Line type="monotone" dataKey="mttc" name="MTTC" stroke="#ffc107" strokeWidth={2} dot={{ r: 3, fill: '#ffc107' }} />
            <Line type="monotone" dataKey="mttr" name="MTTR" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#a855f7' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 8 }}>
          By Incident Category
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          {categoryMetrics.map(m => (
            <div key={m.category} style={{ background: 'var(--bg)', padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{m.label}</span>
                <TrendIcon trend={m.trend} size={11} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 11 }}>
                {[
                  { k: 'MTTD', v: m.mttd, t: TARGETS.mttd, color: '#00d4ff' },
                  { k: 'MTTC', v: m.mttc, t: TARGETS.mttc, color: '#ffc107' },
                  { k: 'MTTR', v: m.mttr, t: TARGETS.mttr, color: '#a855f7' },
                ].map(({ k, v, t, color }) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: v <= t ? 'var(--low)' : 'var(--medium)', fontSize: 13 }}>
                      {v}h
                    </div>
                  </div>
                ))}
              </div>
              {m.incidentCount > 0 && (
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
                  {m.incidentCount} incident{m.incidentCount !== 1 ? 's' : ''} YTD
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
