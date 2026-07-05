import { ArrowUp } from 'lucide-react';
import type { EscalationRule } from '../../models';

interface Props {
  rules: EscalationRule[];
}

const TIER_COLORS: Record<string, string> = {
  'risk-owner': 'var(--low)',
  'ciso':       'var(--cyan)',
  'cro':        'var(--medium)',
  'board':      'var(--critical)',
};

export default function EscalationMatrix({ rules }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Escalation Matrix</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>4-tier escalation path</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
        {[...rules].reverse().map((rule, idx) => {
          const color = TIER_COLORS[rule.tier] ?? 'var(--cyan)';
          const isTop = idx === 0;
          return (
            <div key={rule.tier} style={{
              background: 'var(--card)',
              padding: '14px 20px',
              borderLeft: `3px solid ${color}`,
              position: 'relative',
            }}>
              {!isTop && (
                <div style={{ position: 'absolute', left: 26, top: -12, color: 'var(--text-3)' }}>
                  <ArrowUp size={12} />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {rule.label}
                  </span>
                  <span style={{ fontSize: 10, background: `${color}15`, color, padding: '1px 7px', borderRadius: 3, fontWeight: 600 }}>
                    SLA: {rule.sla}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{rule.channel}</span>
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Triggers</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {rule.triggers.map(t => (
                      <div key={t} style={{ fontSize: 11, color: 'var(--text-2)', paddingLeft: 8, borderLeft: `1px solid ${color}40` }}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ width: 200 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Notify</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {rule.notifyRoles.map(r => (
                      <div key={r} style={{ fontSize: 11, color, fontWeight: 500 }}>{r}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
