import { useEffect, useState } from 'react';
import { Calculator, TrendingUp, Info, Layers, Grid3X3, GitBranch } from 'lucide-react';
import type {
  ScoringMethodology,
  DomainWeight,
  ScoreBand,
  LikelihoodImpactCell,
  FrameworkCalibration,
  ControlEffectivenessExample,
} from '../models';
import { ScoringService } from '../services/ScoringService';

// ─── Helpers ───────────────────────────────────────────────────────────────

function bandForScore(score: number, bands: ScoreBand[]): ScoreBand | undefined {
  return bands.find(b => score >= b.min && score <= b.max);
}

function likelihoodLabel(n: number): string {
  return ['', 'Very Unlikely', 'Unlikely', 'Possible', 'Likely', 'Very Likely'][n] ?? '';
}

function impactLabel(n: number): string {
  return ['', 'Minimal', 'Minor', 'Moderate', 'Major', 'Catastrophic'][n] ?? '';
}

// ─── Sub-components ────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: '16px 20px',
      minWidth: 160,
      flex: '1 1 160px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
      <div style={{ marginTop: 2 }}>
        <Icon size={16} color="var(--cyan)" strokeWidth={1.8} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

// ─── Formula Flow Section ──────────────────────────────────────────────────

function FormulaFlow({ method }: { method: ScoringMethodology }) {
  const steps = [
    { label: 'Likelihood Rating', sub: '1 – 5 scale', color: '#4FC3F7', detail: 'Assessed quarterly by domain owners based on threat intelligence and historical incident frequency.' },
    { label: 'Impact Rating',     sub: '1 – 5 scale', color: '#CE93D8', detail: 'Scored across financial, operational, reputational and regulatory dimensions. Maximum score applied.' },
    { label: 'Inherent Score',    sub: 'L × I × 4', color: '#FFB74D', detail: 'Raw score before controls. Maximum 100. Represents unmitigated exposure if all controls failed.' },
    { label: 'Control Effectiveness', sub: '% reduction', color: '#81C784', detail: 'Average of all control effectiveness ratings (0 – 100%) from the last attestation cycle.' },
    { label: 'Residual Score',    sub: 'Inherent × (1 – CE%)', color: '#EF9A9A', detail: 'Score after control mitigation. This is what appears on domain and risk dashboards.' },
  ];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <SectionHeader icon={Calculator} title="Risk Score Formula" subtitle="How each individual risk score is derived from first principles" />

      {/* Step chain */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', marginBottom: 28, justifyContent: 'flex-start' }}>
        {steps.map((step, idx) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: `${step.color}15`,
              border: `1px solid ${step.color}50`,
              borderRadius: 8,
              padding: '10px 14px',
              textAlign: 'center',
              minWidth: 100,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: step.color }}>{step.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{step.sub}</div>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ padding: '0 8px', color: 'var(--text-muted)', fontSize: 14, fontWeight: 300 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Step detail cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {steps.map(step => (
          <div key={step.label} style={{
            background: `${step.color}08`,
            border: `1px solid ${step.color}25`,
            borderRadius: 6,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: step.color, marginBottom: 4 }}>{step.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.detail}</div>
          </div>
        ))}
      </div>

      {/* Control effectiveness examples */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
          Control Effectiveness Examples (Live Domain Data)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {method.controlExamples.map(ex => (
            <div key={ex.domain} style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{ex.domain}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Inherent</span><span style={{ fontWeight: 600, color: '#FF8C00' }}>{ex.inherentScore}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Control Eff.</span><span style={{ fontWeight: 600, color: '#81C784' }}>{ex.controlEffectiveness}%</span>
              </div>
              <div style={{
                height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginTop: 2,
              }}>
                <div style={{
                  height: '100%',
                  width: `${ex.inherentScore}%`,
                  background: '#FF8C00',
                  borderRadius: 2,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', right: 0, top: 0,
                    height: '100%',
                    width: `${(ex.controlEffectiveness / 100) * 100}%`,
                    background: '#81C784',
                    borderRadius: '0 2px 2px 0',
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Residual</span><span style={{ fontWeight: 700, color: 'var(--text)' }}>{ex.residualScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Domain Weight Breakdown ───────────────────────────────────────────────

function DomainWeightTable({ weights, bands }: { weights: DomainWeight[]; bands: ScoreBand[] }) {
  const total = weights.reduce((s, w) => s + w.weightedScore, 0);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <SectionHeader icon={Layers} title="Domain Weight Breakdown" subtitle="How each domain contributes to the composite score" />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Domain', 'Weight', 'Current Score', 'Score Band', 'Weighted Contribution', 'Rationale'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weights.map((w, idx) => {
              const band = bandForScore(w.currentScore, bands);
              return (
                <tr key={w.domainId} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                  {/* Domain */}
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: w.color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{w.domainName}</span>
                    </div>
                  </td>
                  {/* Weight */}
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 50, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${(w.weight / 15) * 100}%`, height: '100%', background: w.color, borderRadius: 2 }} />
                      </div>
                      <span style={{ color: 'var(--text)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{w.weight}%</span>
                    </div>
                  </td>
                  {/* Score */}
                  <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ color: band?.color ?? 'var(--text)', fontWeight: 700, fontSize: 14 }}>{w.currentScore}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/100</span>
                  </td>
                  {/* Band */}
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      background: `${band?.color ?? '#666'}20`,
                      color: band?.color ?? 'var(--text)',
                      border: `1px solid ${band?.color ?? '#666'}40`,
                      borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600,
                    }}>{band?.label}</span>
                  </td>
                  {/* Weighted contribution */}
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${(w.weightedScore / total) * 100}%`, height: '100%', background: w.color, borderRadius: 2 }} />
                      </div>
                      <span style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{w.weightedScore.toFixed(1)} pts</span>
                    </div>
                  </td>
                  {/* Rationale */}
                  <td style={{ padding: '10px 12px', maxWidth: 280, color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.4 }}>
                    {w.rationale}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text)' }}>Total</td>
              <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text)' }}>100%</td>
              <td colSpan={2} />
              <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--cyan)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(total)} / 100</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Score Band Scale ──────────────────────────────────────────────────────

function ScoreBandScale({ bands, compositeScore }: { bands: ScoreBand[]; compositeScore: number }) {
  const current = bandForScore(compositeScore, bands);
  const sortedBands = [...bands].sort((a, b) => a.min - b.min);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <SectionHeader icon={TrendingUp} title="Score Bands" subtitle="Risk tolerance thresholds and required actions" />

      {/* Visual bar */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {sortedBands.map(b => (
            <div key={b.label} style={{
              width: `${(b.max - b.min + 1)}%`,
              background: `${b.color}60`,
              borderRight: b.max < 100 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: b.color }}>{b.label}</span>
            </div>
          ))}
        </div>
        {/* Marker */}
        <div style={{
          position: 'absolute', top: -6,
          left: `calc(${compositeScore}% - 1px)`,
          width: 2, height: 32,
          background: 'var(--text)',
          borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute', top: -18,
          left: `calc(${compositeScore}% - 18px)`,
          background: current?.color ?? 'var(--text)',
          color: '#000', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700,
        }}>
          {compositeScore}
        </div>
      </div>

      {/* Band cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {sortedBands.slice().reverse().map(b => {
          const active = current?.label === b.label;
          return (
            <div key={b.label} style={{
              background: active ? `${b.color}15` : 'var(--bg)',
              border: `1px solid ${active ? b.color : 'var(--border)'}`,
              borderLeft: `3px solid ${b.color}`,
              borderRadius: 8,
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: b.color }}>{b.label}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{b.min} – {b.max}</span>
                {active && (
                  <span style={{ marginLeft: 'auto', background: b.color, color: '#000', borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>
                    CURRENT
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>{b.description}</div>
              <div style={{
                background: `${b.color}10`, border: `1px solid ${b.color}30`,
                borderRadius: 4, padding: '8px 10px', fontSize: 10, color: b.color, lineHeight: 1.5,
              }}>
                <strong>Required Action:</strong> {b.action}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Likelihood × Impact Matrix ────────────────────────────────────────────

function LikelihoodImpactMatrix({ cells }: { cells: LikelihoodImpactCell[] }) {
  const lValues = [5, 4, 3, 2, 1];
  const iValues = [1, 2, 3, 4, 5];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <SectionHeader icon={Grid3X3} title="Likelihood × Impact Matrix" subtitle="Inherent risk scoring grid — all residual scores trace back to this matrix" />

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'inline-block', minWidth: 360 }}>
          {/* Column headers (impact) */}
          <div style={{ display: 'flex', marginLeft: 120, marginBottom: 6, gap: 4 }}>
            {iValues.map(i => (
              <div key={i} style={{ width: 60, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
                <div style={{ fontWeight: 600 }}>{i}</div>
                <div>{impactLabel(i)}</div>
              </div>
            ))}
          </div>
          {/* Impact axis label */}
          <div style={{ display: 'flex', marginLeft: 120, marginBottom: 4 }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Impact →</div>
          </div>

          {/* Rows (likelihood) */}
          {lValues.map(l => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              {/* Row header */}
              <div style={{ width: 120, textAlign: 'right', paddingRight: 10, fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
                <div style={{ fontWeight: 600 }}>{l} — {likelihoodLabel(l)}</div>
              </div>
              {iValues.map(i => {
                const cell = cells.find(c => c.likelihood === l && c.impact === i);
                if (!cell) return null;
                return (
                  <div
                    key={i}
                    title={`L${l} × I${i} = ${cell.rawScore} (${cell.label})`}
                    style={{
                      width: 60, height: 40,
                      background: `${cell.color}30`,
                      border: `1px solid ${cell.color}60`,
                      borderRadius: 4,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'default',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: cell.color, fontVariantNumeric: 'tabular-nums' }}>{cell.rawScore}</div>
                    <div style={{ fontSize: 8, color: cell.color, fontWeight: 600 }}>{cell.label}</div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Likelihood axis label */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: 115, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingRight: 10, marginBottom: 4 }}>
            Likelihood ↑
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Low (1–4)',       color: '#00E676' },
          { label: 'Medium (5–9)',    color: '#FFD600' },
          { label: 'High (10–16)',    color: '#FF8C00' },
          { label: 'Critical (≥20)', color: '#FF5252' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, background: `${l.color}40`, border: `1px solid ${l.color}`, borderRadius: 2 }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Framework Calibration ─────────────────────────────────────────────────

function FrameworkCalibrationPanel({
  calibrations, compositeScore, bands,
}: { calibrations: FrameworkCalibration[]; compositeScore: number; bands: ScoreBand[] }) {
  const [selected, setSelected] = useState(0);
  const fw = calibrations[selected];
  const currentBand = bandForScore(compositeScore, bands);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <SectionHeader icon={GitBranch} title="Framework Calibration" subtitle="How our composite score maps to industry regulatory frameworks" />

      {/* Framework selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {calibrations.map((c, idx) => (
          <button
            key={c.framework}
            onClick={() => setSelected(idx)}
            style={{
              padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: selected === idx ? '1px solid var(--cyan)' : '1px solid var(--border)',
              background: selected === idx ? 'rgba(0,212,255,0.1)' : 'var(--bg)',
              color: selected === idx ? 'var(--cyan)' : 'var(--text-muted)',
            }}
          >
            {c.framework}
            <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.7 }}>v{c.version}</span>
          </button>
        ))}
      </div>

      {/* Current mapping callout */}
      {fw && (() => {
        const match = fw.ranges.find(r => compositeScore >= r.ourScoreMin && compositeScore <= r.ourScoreMax);
        if (!match) return null;
        return (
          <div style={{
            background: `${currentBand?.color ?? 'var(--cyan)'}15`,
            border: `1px solid ${currentBand?.color ?? 'var(--cyan)'}40`,
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Info size={16} color={currentBand?.color ?? 'var(--cyan)'} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: currentBand?.color ?? 'var(--cyan)' }}>
                Current Mapping: {match.frameworkLevel}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{match.description}</div>
            </div>
          </div>
        );
      })()}

      {/* Range table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {fw?.ranges.slice().reverse().map(r => {
          const band = bandForScore(r.ourScoreMin + 1, bands);
          const active = compositeScore >= r.ourScoreMin && compositeScore <= r.ourScoreMax;
          return (
            <div key={r.frameworkLevel} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px',
              background: active ? `${band?.color ?? '#666'}10` : 'var(--bg)',
              border: `1px solid ${active ? band?.color ?? '#666' : 'var(--border)'}`,
              borderRadius: 8,
            }}>
              <div style={{
                minWidth: 60, textAlign: 'center',
                background: `${band?.color ?? '#666'}20`,
                border: `1px solid ${band?.color ?? '#666'}40`,
                borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700, color: band?.color ?? 'var(--text)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {r.ourScoreMin}–{r.ourScoreMax}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{r.frameworkLevel}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.description}</div>
              </div>
              {active && (
                <span style={{ background: band?.color ?? '#666', color: '#000', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  YOU ARE HERE
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main View ─────────────────────────────────────────────────────────────

export default function ScoringView() {
  const [method, setMethod] = useState<ScoringMethodology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ScoringService.getMethodology()
      .then(setMethod)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading scoring methodology…</div>
      </div>
    );
  }

  if (error || !method) {
    return (
      <div style={{ padding: 32, color: 'var(--critical)', fontSize: 13 }}>
        Error: {error || 'Failed to load data'}
      </div>
    );
  }

  const currentBand = method.scoreBands.find(
    b => method.compositeScore >= b.min && method.compositeScore <= b.max,
  );

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1280 }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Calculator size={20} color="var(--cyan)" strokeWidth={1.8} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Scoring Methodology</h1>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 30 }}>
          Formula transparency — understand exactly why every risk score is at its current level
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard
          label="Composite Score"
          value={String(method.compositeScore)}
          sub={`Band: ${currentBand?.label ?? '—'}`}
          color={currentBand?.color ?? 'var(--cyan)'}
        />
        <StatCard
          label="Domains Measured"
          value={String(method.domainWeights.length)}
          sub="Weighted contributors"
          color="var(--cyan)"
        />
        <StatCard
          label="Highest Domain"
          value={String(Math.max(...method.domainWeights.map(d => d.currentScore)))}
          sub={method.domainWeights.reduce((m, d) => d.currentScore > m.currentScore ? d : m).domainName}
          color="#FF5252"
        />
        <StatCard
          label="Lowest Domain"
          value={String(Math.min(...method.domainWeights.map(d => d.currentScore)))}
          sub={method.domainWeights.reduce((m, d) => d.currentScore < m.currentScore ? d : m).domainName}
          color="#00E676"
        />
        <StatCard
          label="Last Updated"
          value={new Date(method.lastUpdated).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}
          sub="Weights & calibration"
          color="var(--text-muted)"
        />
      </div>

      {/* Formula description banner */}
      <div style={{
        background: 'rgba(0,212,255,0.08)',
        border: '1px solid rgba(0,212,255,0.25)',
        borderRadius: 8,
        padding: '12px 18px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Info size={15} color="var(--cyan)" />
        <div>
          <span style={{ color: 'var(--cyan)', fontWeight: 600, fontSize: 13 }}>Composite Formula: </span>
          <span style={{ color: 'var(--text)', fontSize: 13, fontFamily: 'monospace' }}>{method.compositeFormula}</span>
        </div>
      </div>

      {/* Section 1: Formula flow */}
      <div style={{ marginBottom: 20 }}>
        <FormulaFlow method={method} />
      </div>

      {/* Section 2: Domain weights */}
      <div style={{ marginBottom: 20 }}>
        <DomainWeightTable weights={method.domainWeights} bands={method.scoreBands} />
      </div>

      {/* Section 3: Score bands */}
      <div style={{ marginBottom: 20 }}>
        <ScoreBandScale bands={method.scoreBands} compositeScore={method.compositeScore} />
      </div>

      {/* Sections 4 & 5: Matrix + Framework (side by side on wide screens) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: 20, marginBottom: 20 }}>
        <LikelihoodImpactMatrix cells={method.likelihoodImpactMatrix} />
        <FrameworkCalibrationPanel
          calibrations={method.frameworkCalibrations}
          compositeScore={method.compositeScore}
          bands={method.scoreBands}
        />
      </div>

    </div>
  );
}
