import { CheckCircle2, Calendar } from 'lucide-react';
import type { RiskAppetite } from '../../models';

interface Props {
  appetite: RiskAppetite;
}

const LEVEL_COLOR: Record<string, string> = {
  critical: 'var(--critical)',
  high:     'var(--high)',
  medium:   'var(--medium)',
  low:      'var(--low)',
};

export default function RiskAppetitePanel({ appetite }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Risk Appetite Statement</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {appetite.boardEndorsed && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--low)' }}>
              <CheckCircle2 size={12} />
              Board Endorsed
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8,
          background: 'rgba(0,212,255,0.03)', borderLeft: '3px solid var(--cyan)',
          borderRadius: '0 6px 6px 0', padding: '12px 16px',
        }}>
          {appetite.statement}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: 'var(--text-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={11} /> Approved {new Date(appetite.approvedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <span>Approved by: <strong style={{ color: 'var(--text-2)' }}>{appetite.approvedBy}</strong></span>
          <span>Next review: <strong style={{ color: 'var(--text-2)' }}>{new Date(appetite.nextReview).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></span>
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 10 }}>
            Tolerance Thresholds
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {appetite.thresholds.map(t => {
              const color   = LEVEL_COLOR[t.level];
              const overMax = t.current > t.maxAllowed;
              const pct     = t.maxAllowed === 0
                ? (t.current > 0 ? 100 : 0)
                : Math.min((t.current / (t.maxAllowed * 1.5)) * 100, 100);

              return (
                <div key={t.level}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>{t.label}</span>
                      {overMax && (
                        <span style={{ fontSize: 10, background: 'var(--critical-10)', color: 'var(--critical)', padding: '1px 7px', borderRadius: 3, fontWeight: 700 }}>
                          BREACHED
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                      <span style={{ color: overMax ? 'var(--critical)' : 'var(--low)' }}>
                        Current: <strong>{t.current}</strong>
                      </span>
                      <span style={{ color: 'var(--text-3)' }}>
                        Limit: {t.maxAllowed === 0 ? 'Zero tolerance' : t.maxAllowed}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: 3,
                      background: overMax ? 'var(--critical)' : color,
                      boxShadow: overMax ? '0 0 8px rgba(255,51,51,0.4)' : 'none',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
