import { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle, Eye, TrendingUp, Cpu, Users } from 'lucide-react';
import type { AIFinOpsData, AIToolSpend, DepartmentSpend, AIFinOpsMonthlyTrend } from '../models';
import { AIFinOpsService } from '../services/AIFinOpsService';

// ─── Helpers ───────────────────────────────────────────────────────────────

const fmt$ = (n: number) =>
  n >= 1_000 ? `$${(n / 1_000).toFixed(1)}k` : `$${n.toFixed(0)}`;

const RISK_COLOR: Record<string, string> = {
  low:      '#00E676',
  medium:   '#FFD600',
  high:     '#FF8C00',
  critical: '#FF5252',
};

// ─── Stat Card ─────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, color,
}: { icon: React.ElementType; label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      flex: '1 1 150px', minWidth: 150,
      background: 'var(--surface)',
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8, padding: '14px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Icon size={12} color={color} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>
    </div>
  );
}

// ─── Trend Bar Chart ───────────────────────────────────────────────────────

function TrendChart({ months }: { months: AIFinOpsMonthlyTrend[] }) {
  const maxTotal = Math.max(...months.map(m => m.sanctionedSpend + m.shadowSpend));
  const W = 60, GAP = 10, H = 140;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Monthly Spend Trend</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>Sanctioned vs shadow AI spend — Jan to Jun 2026</div>

      <div style={{ overflowX: 'auto' }}>
        <svg
          width={months.length * (W + GAP)}
          height={H + 60}
          style={{ display: 'block' }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(pct => {
            const y = H - pct * H;
            return (
              <g key={pct}>
                <line x1={0} y1={y} x2={months.length * (W + GAP)} y2={y}
                  stroke="var(--border)" strokeWidth={0.5} />
                <text x={0} y={y - 3} fontSize={8} fill="var(--text-muted)">
                  {fmt$(pct * maxTotal)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {months.map((m, idx) => {
            const x = idx * (W + GAP) + 20;
            const sanctH = (m.sanctionedSpend / maxTotal) * H;
            const shadowH = (m.shadowSpend / maxTotal) * H;
            const totalH = sanctH + shadowH;
            return (
              <g key={m.month}>
                {/* Sanctioned bar (bottom) */}
                <rect
                  x={x} y={H - totalH} width={W} height={sanctH}
                  fill="rgba(0,212,255,0.55)" rx={2}
                />
                {/* Shadow bar (top) */}
                <rect
                  x={x} y={H - totalH} width={W} height={shadowH}
                  fill="rgba(255,82,82,0.7)" rx={2}
                />
                {/* Month label */}
                <text x={x + W / 2} y={H + 16} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
                  {m.month.split(' ')[0]}
                </text>
                {/* Total label */}
                <text x={x + W / 2} y={H - totalH - 4} textAnchor="middle" fontSize={9} fill="var(--text)" fontWeight="600">
                  {fmt$(m.sanctionedSpend + m.shadowSpend)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(0,212,255,0.55)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sanctioned</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(255,82,82,0.7)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Shadow AI</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sanctioned vs Shadow split ────────────────────────────────────────────

function SpendSplit({ data }: { data: AIFinOpsData }) {
  const { stats } = data;
  const sanctPct = 100 - stats.shadowPercentage;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Spend Composition</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>{data.reportingPeriod} · Budget: {fmt$(data.monthlyBudget)}/mo</div>

      {/* Split bar */}
      <div style={{ height: 28, borderRadius: 6, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
        <div style={{ width: `${sanctPct}%`, background: 'rgba(0,212,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan)' }}>{sanctPct.toFixed(1)}%</span>
        </div>
        <div style={{ width: `${stats.shadowPercentage}%`, background: 'rgba(255,82,82,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FF5252' }}>{stats.shadowPercentage}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>SANCTIONED</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--cyan)', fontVariantNumeric: 'tabular-nums' }}>{fmt$(stats.sanctionedSpend)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{data.toolSpend.filter(t => t.status === 'sanctioned').length} approved tools</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.25)', borderRadius: 6, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>SHADOW AI</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#FF5252', fontVariantNumeric: 'tabular-nums' }}>{fmt$(stats.shadowSpend)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stats.shadowToolCount} unauthorised tools detected</div>
        </div>
      </div>

      {/* Budget utilisation */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
          <span>Budget utilisation</span>
          <span style={{ fontWeight: 600, color: stats.budgetUtilisation > 90 ? '#FF5252' : stats.budgetUtilisation > 75 ? '#FF8C00' : 'var(--text)' }}>
            {stats.budgetUtilisation}% of {fmt$(data.monthlyBudget)}
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(stats.budgetUtilisation, 100)}%`,
            background: stats.budgetUtilisation > 90 ? '#FF5252' : stats.budgetUtilisation > 75 ? '#FF8C00' : 'var(--cyan)',
            borderRadius: 3,
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Tool Spend Table ──────────────────────────────────────────────────────

function ToolSpendTable({ tools }: { tools: AIToolSpend[] }) {
  const [tab, setTab] = useState<'all' | 'sanctioned' | 'shadow'>('all');

  const filtered = tools
    .filter(t => tab === 'all' || t.status === tab)
    .sort((a, b) => b.monthlySpend - a.monthlySpend);

  const maxSpend = Math.max(...filtered.map(t => t.monthlySpend), 1);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Tool Spend</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>All sanctioned and shadow tools sorted by monthly cost</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'sanctioned', 'shadow'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${tab === t ? (t === 'shadow' ? '#FF5252' : 'var(--cyan)') : 'var(--border)'}`,
              background: tab === t ? (t === 'shadow' ? 'rgba(255,82,82,0.12)' : 'rgba(0,212,255,0.1)') : 'var(--bg)',
              color: tab === t ? (t === 'shadow' ? '#FF5252' : 'var(--cyan)') : 'var(--text-muted)',
              textTransform: 'capitalize',
            }}>
              {t === 'all' ? 'All Tools' : t === 'shadow' ? '⚠ Shadow' : 'Sanctioned'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Tool', 'Vendor', 'Status', 'Department', 'Monthly Cost', 'Tokens (M)', 'Users', 'Data Risk', 'Discovery'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool, idx) => (
              <tr key={tool.toolId} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                <td style={{ padding: '10px 10px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{tool.toolName}</td>
                <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{tool.vendor}</td>
                <td style={{ padding: '10px 10px' }}>
                  <span style={{
                    background: tool.status === 'sanctioned' ? 'rgba(0,212,255,0.12)' : 'rgba(255,82,82,0.12)',
                    color: tool.status === 'sanctioned' ? 'var(--cyan)' : '#FF5252',
                    border: `1px solid ${tool.status === 'sanctioned' ? 'rgba(0,212,255,0.3)' : 'rgba(255,82,82,0.3)'}`,
                    borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700,
                  }}>
                    {tool.status === 'shadow' ? '⚠ Shadow' : 'Sanctioned'}
                  </span>
                </td>
                <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{tool.department}</td>
                <td style={{ padding: '10px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${(tool.monthlySpend / maxSpend) * 100}%`, height: '100%', background: tool.status === 'shadow' ? '#FF5252' : 'var(--cyan)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{fmt$(tool.monthlySpend)}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 10px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{tool.tokenUsage.toFixed(1)}</td>
                <td style={{ padding: '10px 10px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{tool.users}</td>
                <td style={{ padding: '10px 10px' }}>
                  <span style={{
                    background: `${RISK_COLOR[tool.dataRiskLevel]}15`,
                    color: RISK_COLOR[tool.dataRiskLevel],
                    border: `1px solid ${RISK_COLOR[tool.dataRiskLevel]}35`,
                    borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, textTransform: 'capitalize',
                  }}>{tool.dataRiskLevel}</span>
                </td>
                <td style={{ padding: '10px 10px', maxWidth: 220, color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.4 }}>
                  {tool.discoveredVia ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Department Breakdown ──────────────────────────────────────────────────

function DepartmentTable({ depts }: { depts: DepartmentSpend[] }) {
  const sorted = [...depts].sort((a, b) => b.totalSpend - a.totalSpend);
  const maxTotal = Math.max(...sorted.map(d => d.totalSpend), 1);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Department Breakdown</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>Shadow AI risk flags where unauthorised spend exceeds 20% of department total</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(dept => {
          const shadowPct = dept.totalSpend > 0 ? (dept.shadowSpend / dept.totalSpend) * 100 : 0;
          return (
            <div key={dept.department} style={{
              background: dept.riskFlag ? 'rgba(255,82,82,0.05)' : 'var(--bg)',
              border: `1px solid ${dept.riskFlag ? 'rgba(255,82,82,0.3)' : 'var(--border)'}`,
              borderLeft: `3px solid ${dept.riskFlag ? '#FF5252' : 'var(--border)'}`,
              borderRadius: 8, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {dept.riskFlag && <AlertTriangle size={13} color="#FF5252" />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: dept.riskFlag ? '#FF5252' : 'var(--text)' }}>{dept.department}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· Top: {dept.topTool}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sanctioned: <strong style={{ color: 'var(--cyan)' }}>{fmt$(dept.sanctionedSpend)}</strong></span>
                  {dept.shadowSpend > 0 && (
                    <span style={{ color: 'var(--text-muted)' }}>Shadow: <strong style={{ color: '#FF5252' }}>{fmt$(dept.shadowSpend)}</strong></span>
                  )}
                  <span style={{ color: 'var(--text-muted)' }}>Total: <strong style={{ color: 'var(--text)' }}>{fmt$(dept.totalSpend)}</strong></span>
                </div>
              </div>

              {/* Stacked bar */}
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(dept.sanctionedSpend / maxTotal) * 100}%`, height: '100%', background: 'rgba(0,212,255,0.55)' }} />
                <div style={{ width: `${(dept.shadowSpend / maxTotal) * 100}%`, height: '100%', background: 'rgba(255,82,82,0.7)' }} />
              </div>

              {dept.shadowSpend > 0 && (
                <div style={{ fontSize: 10, color: '#FF8C00', marginTop: 4 }}>
                  {shadowPct.toFixed(0)}% of this department's AI spend is unauthorised
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main View ─────────────────────────────────────────────────────────────

export default function AIFinOpsView() {
  const [data,    setData]    = useState<AIFinOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    AIFinOpsService.getData()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading AI FinOps data…</div>
    </div>
  );

  if (error || !data) return (
    <div style={{ padding: 32, color: 'var(--critical)', fontSize: 13 }}>Error: {error || 'Failed to load data'}</div>
  );

  const { stats } = data;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1280 }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <DollarSign size={20} color="var(--cyan)" strokeWidth={1.8} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>AI FinOps</h1>
          {stats.shadowToolCount > 0 && (
            <span style={{ background: 'rgba(255,82,82,0.15)', color: '#FF5252', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 10, padding: '1px 10px', fontSize: 11, fontWeight: 700 }}>
              {stats.shadowToolCount} shadow tools detected
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 30 }}>
          AI spend transparency — sanctioned investment vs shadow AI cost and data risk exposure · {data.reportingPeriod}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard icon={DollarSign}    label="Total Monthly Spend" value={fmt$(stats.totalMonthlySpend)}   sub={`${stats.budgetUtilisation}% of budget`}           color="var(--cyan)"  />
        <StatCard icon={AlertTriangle} label="Shadow AI Spend"      value={fmt$(stats.shadowSpend)}         sub={`${stats.shadowPercentage}% of total`}              color="#FF5252"      />
        <StatCard icon={Eye}           label="Shadow Tools Found"   value={String(stats.shadowToolCount)}   sub={`of ${stats.toolCount} total tools tracked`}        color="#FF8C00"      />
        <StatCard icon={Cpu}           label="Tokens This Month"    value={`${stats.totalTokensThisMonth}M`} sub="across all sanctioned tools"                       color="var(--cyan)"  />
        <StatCard icon={TrendingUp}    label="Cost per Decision"    value={`$${stats.costPerRiskDecision}`} sub="per AI-assisted risk decision"                     color="#CE93D8"      />
        <StatCard icon={Users}         label="Departments Tracked"  value={String(stats.departmentCount)}   sub={`${data.departmentBreakdown.filter(d => d.riskFlag).length} with shadow risk flag`} color="#4FC3F7" />
      </div>

      {/* Trend + Spend split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 20, marginBottom: 20 }}>
        <TrendChart months={data.monthlyTrend} />
        <SpendSplit data={data} />
      </div>

      {/* Tool spend table */}
      <div style={{ marginBottom: 20 }}>
        <ToolSpendTable tools={data.toolSpend} />
      </div>

      {/* Department breakdown */}
      <div style={{ marginBottom: 20 }}>
        <DepartmentTable depts={data.departmentBreakdown} />
      </div>

    </div>
  );
}
