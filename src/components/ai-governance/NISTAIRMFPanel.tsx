import type { NISTAIRMFDomain } from '../../models';

interface Props {
  domains: NISTAIRMFDomain[];
}

const FUNCTION_COLORS: Record<string, string> = {
  govern:  '#a855f7',
  map:     '#00d4ff',
  measure: '#ffc107',
  manage:  '#00d68f',
};

function MaturityRing({ maturity, color }: { maturity: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - maturity / 100);
  return (
    <svg width={70} height={70} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={7} />
      <circle
        cx={35} cy={35} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${color}60)` }}
      />
    </svg>
  );
}

export default function NISTAIRMFPanel({ domains }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title" style={{ color: 'var(--text)' }}>
          NIST AI RMF Coverage
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Govern · Map · Measure · Manage</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
        {domains.map(d => {
          const color = FUNCTION_COLORS[d.function] ?? 'var(--cyan)';
          return (
            <div key={d.function} style={{ background: 'var(--card)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <MaturityRing maturity={d.maturity} color={color} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'JetBrains Mono', color }}>{d.maturity}</span>
                    <span style={{ fontSize: 8, color: 'var(--text-3)' }}>/ 100</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.5 }}>
                    {d.description}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                  Categories
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {d.categories.map(c => (
                    <span key={c} style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: `${color}12`, color, border: `1px solid ${color}25`,
                    }}>{c}</span>
                  ))}
                </div>
              </div>

              {d.gaps.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--critical)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Gaps
                  </div>
                  {d.gaps.map(g => (
                    <div key={g} style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 3, paddingLeft: 10, borderLeft: '2px solid var(--critical-10)' }}>
                      {g}
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
