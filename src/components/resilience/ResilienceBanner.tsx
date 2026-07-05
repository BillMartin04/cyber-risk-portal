import { Activity, Clock, Shield, Target, BookOpen, Calendar } from 'lucide-react';
import type { ResilienceStats } from '../../models';

interface Props { stats: ResilienceStats; }

function MetricGauge({ label, value, target, unit = 'h', lowerIsBetter = true }: {
  label: string; value: number; target: number; unit?: string; lowerIsBetter?: boolean;
}) {
  const onTarget = lowerIsBetter ? value <= target : value >= target;
  const color    = onTarget ? 'var(--low)' : value <= target * 1.5 ? 'var(--medium)' : 'var(--critical)';
  return (
    <div className="res-gauge">
      <div className="res-gauge-label">{label}</div>
      <div className="res-gauge-value" style={{ color }}>
        {value}{unit}
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}>
          {' '}/ target {target}{unit}
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
        <div style={{
          width: lowerIsBetter
            ? `${Math.min((target / Math.max(value, 0.1)) * 100, 100)}%`
            : `${Math.min((value / target) * 100, 100)}%`,
          height: '100%', background: color, borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

export default function ResilienceBanner({ stats }: Props) {
  const kpis = [
    { label: 'Playbooks Ready',   value: `${stats.playbooksTested}/${stats.playbooksTotal}`, color: stats.playbooksTested >= stats.playbooksTotal * 0.8 ? 'var(--low)' : 'var(--medium)', icon: BookOpen },
    { label: 'Detection Rate',    value: `${stats.detectionRate}%`,  color: stats.detectionRate >= stats.detectionTarget ? 'var(--low)' : 'var(--medium)', icon: Target },
    { label: 'Tier-1 Services',   value: stats.criticalServices,     color: 'var(--text)',    icon: Shield },
    { label: 'RTO Met',           value: `${stats.servicesRTOMet}/${stats.criticalServices + 1}`, color: 'var(--low)', icon: Activity },
    { label: 'Last Exercise',     value: `${stats.lastExerciseDays}d ago`, color: stats.lastExerciseDays > 90 ? 'var(--medium)' : 'var(--low)', icon: Calendar },
  ];

  return (
    <div className="res-banner">
      <div className="res-banner-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="res-banner-icon">
            <Activity size={26} color="var(--cyan)" strokeWidth={1.6} />
          </div>
          <div>
            <div className="res-banner-title">Resilience & Business Impact</div>
            <div className="res-banner-sub">
              NIST CSF 2.0 · Detect · Respond · Recover · Your Organization · Q2 2026
            </div>
          </div>
        </div>
      </div>

      <div className="res-banner-body">
        <div className="res-gauges">
          <MetricGauge label="Avg. MTTD"  value={stats.avgMTTD} target={stats.mttdTarget} />
          <MetricGauge label="Avg. MTTC"  value={stats.avgMTTC} target={stats.mttcTarget} />
          <MetricGauge label="Avg. MTTR"  value={stats.avgMTTR} target={stats.mttrTarget} />
        </div>

        <div className="res-kpi-row">
          {kpis.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="res-kpi">
              <Icon size={12} color={color} />
              <div className="res-kpi-value" style={{ color }}>{value}</div>
              <div className="res-kpi-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
