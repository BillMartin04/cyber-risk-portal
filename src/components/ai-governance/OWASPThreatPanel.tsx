import type { OWASPThreat } from '../../models';

interface Props {
  threats: OWASPThreat[];
}

export default function OWASPThreatPanel({ threats }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">OWASP LLM Top 10 — 2025</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Threat exposure across AI inventory</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {threats.map(threat => {
          const mitigationPct = threat.affectedModels > 0
            ? Math.round((threat.mitigatedModels / threat.affectedModels) * 100)
            : 100;
          const sevColor = threat.severity === 'critical' ? 'var(--critical)'
                         : threat.severity === 'high'     ? 'var(--high)'
                         : threat.severity === 'medium'   ? 'var(--medium)'
                         : 'var(--low)';

          return (
            <div key={threat.id} className="owasp-row">
              <div className="owasp-row-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
                    color: sevColor, background: `${sevColor}15`,
                    padding: '2px 7px', borderRadius: 4, flexShrink: 0,
                  }}>
                    {threat.id}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{threat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {threat.affectedModels} system{threat.affectedModels !== 1 ? 's' : ''} affected
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    background: `${sevColor}15`, color: sevColor,
                    textTransform: 'uppercase', letterSpacing: '0.4px',
                  }}>
                    {threat.severity}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: '6px 0' }}>
                {threat.description}
              </div>

              {threat.affectedModels > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', width: 90, flexShrink: 0 }}>
                    Mitigation
                  </span>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
                    <div style={{
                      width: `${mitigationPct}%`, height: '100%', borderRadius: 3,
                      background: mitigationPct >= 80 ? 'var(--low)' : mitigationPct >= 50 ? 'var(--medium)' : 'var(--critical)',
                    }} />
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: 'JetBrains Mono', width: 32, textAlign: 'right', flexShrink: 0,
                    color: mitigationPct >= 80 ? 'var(--low)' : mitigationPct >= 50 ? 'var(--medium)' : 'var(--critical)',
                  }}>
                    {mitigationPct}%
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {threat.controlExamples.map(c => (
                  <span key={c} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)', color: 'var(--text-3)',
                    border: '1px solid var(--border)',
                  }}>{c}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
