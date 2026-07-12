import { useEffect, useState } from 'react';
import {
  CheckCircle, Clock, XCircle, AlertTriangle, Search,
  ChevronRight, X, DollarSign, Users, Shield, Globe,
  FileText, History, AlertOctagon,
} from 'lucide-react';
import { AIRegistryService } from '../services/AIRegistryService';
import type { AIRegistryTool, AIRegistryStats, AIToolStatus } from '../repositories/AIRegistryRepository';

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AIToolStatus, { label: string; color: string; icon: React.ReactNode }> = {
  approved:     { label: 'Approved',     color: 'var(--low)',      icon: <CheckCircle size={12} /> },
  pending:      { label: 'Pending',      color: 'var(--medium)',   icon: <Clock size={12} /> },
  prohibited:   { label: 'Prohibited',   color: 'var(--critical)', icon: <XCircle size={12} /> },
  'under-review': { label: 'Under Review', color: 'var(--high)',   icon: <AlertTriangle size={12} /> },
  retired:      { label: 'Retired',      color: 'var(--muted)',    icon: <XCircle size={12} /> },
};

const RISK_COLOR: Record<string, string> = {
  critical: 'var(--critical)',
  high:     'var(--high)',
  medium:   'var(--medium)',
  low:      'var(--low)',
};

const CATEGORY_LABEL: Record<string, string> = {
  'generative-ai':    'Generative AI',
  'code-assistant':   'Code Assistant',
  'data-analysis':    'Data Analysis',
  'automation':       'Automation',
  'search-ai':        'Search AI',
  'image-generation': 'Image Generation',
  'writing-assistant':'Writing Assistant',
};

const DATA_CLASS_COLOR: Record<string, string> = {
  public:       '#22c55e',
  internal:     '#3b82f6',
  confidential: '#f59e0b',
  restricted:   '#ef4444',
};

function StatusBadge({ status }: { status: AIToolStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20,
      background: `${cfg.color}22`, color: cfg.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '.04em',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function RiskBadge({ rating }: { rating: string }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4,
      background: `${RISK_COLOR[rating]}22`, color: RISK_COLOR[rating],
      fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
      textTransform: 'uppercase',
    }}>{rating}</span>
  );
}

// ─── Stats bar ───────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: AIRegistryStats }) {
  const tiles = [
    { label: 'Total Tools',    value: stats.total,                                              color: 'var(--text-secondary)' },
    { label: 'Approved',       value: stats.approved,                                           color: 'var(--low)' },
    { label: 'Pending Review', value: stats.pending + stats.underReview,                        color: 'var(--medium)' },
    { label: 'Prohibited',     value: stats.prohibited,                                         color: 'var(--critical)' },
    { label: 'Monthly Users',  value: stats.totalMonthlyUsers.toLocaleString(),                 color: 'var(--cyan)' },
    { label: 'Monthly Spend',  value: `$${stats.totalMonthlyCost.toLocaleString()}`,            color: 'var(--purple)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
      {tiles.map(t => (
        <div key={t.label} className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.color, fontVariantNumeric: 'tabular-nums' }}>{t.value}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Tool row ────────────────────────────────────────────────────────────────

function ToolRow({ tool, onClick }: { tool: AIRegistryTool; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 90px 140px 80px 24px',
        alignItems: 'center', gap: 16,
        padding: '12px 16px', cursor: 'pointer',
        borderBottom: '1px solid var(--border)',
        transition: 'background .1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{tool.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
          {tool.vendor} · {CATEGORY_LABEL[tool.category] ?? tool.category}
        </div>
      </div>
      <StatusBadge status={tool.status} />
      <RiskBadge rating={tool.riskRating} />
      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
        {tool.dataClassification.length > 0
          ? tool.dataClassification.map(dc => (
              <span key={dc} style={{
                display: 'inline-block', marginRight: 4, marginBottom: 2,
                padding: '1px 6px', borderRadius: 3,
                background: `${DATA_CLASS_COLOR[dc]}22`, color: DATA_CLASS_COLOR[dc],
                fontSize: 10, fontWeight: 600,
              }}>{dc}</span>
            ))
          : <span style={{ color: 'var(--text-muted)' }}>Not set</span>
        }
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
        {tool.monthlyUsers > 0 ? `${tool.monthlyUsers} users` : '—'}
      </div>
      <ChevronRight size={14} color="var(--text-muted)" />
    </div>
  );
}

// ─── Detail panel ────────────────────────────────────────────────────────────

function DetailPanel({ tool, onClose, onStatusChange }: {
  tool: AIRegistryTool;
  onClose: () => void;
  onStatusChange: (id: string, status: AIToolStatus) => void;
}) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
      background: 'var(--surface)', borderLeft: '1px solid var(--border)',
      zIndex: 100, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      boxShadow: '-4px 0 24px rgba(0,0,0,.15)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{tool.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{tool.vendor} · {CATEGORY_LABEL[tool.category]}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={tool.status} />
            <RiskBadge rating={tool.riskRating} />
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '16px 20px', flex: 1 }}>

        {/* Actions */}
        {(tool.status === 'pending' || tool.status === 'under-review') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => onStatusChange(tool.id, 'approved')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--low)', background: 'rgba(34,197,94,.08)', color: 'var(--low)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
              ✓ Approve
            </button>
            <button
              onClick={() => onStatusChange(tool.id, 'prohibited')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--critical)', background: 'rgba(239,68,68,.08)', color: 'var(--critical)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
              ✕ Prohibit
            </button>
            <button
              onClick={() => onStatusChange(tool.id, 'under-review')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--high)', background: 'rgba(245,158,11,.08)', color: 'var(--high)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
              ↺ Review
            </button>
          </div>
        )}
        {tool.status === 'approved' && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => onStatusChange(tool.id, 'under-review')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--high)', background: 'rgba(245,158,11,.08)', color: 'var(--high)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
              Flag for Review
            </button>
            <button
              onClick={() => onStatusChange(tool.id, 'retired')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
              Retire
            </button>
          </div>
        )}

        {/* Prohibition reason */}
        {tool.status === 'prohibited' && tool.prohibitionReason && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', marginBottom: 20, display: 'flex', gap: 10 }}>
            <AlertOctagon size={16} color="var(--critical)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--critical)', marginBottom: 4 }}>PROHIBITION REASON</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tool.prohibitionReason}</div>
            </div>
          </div>
        )}

        {/* Description */}
        <Section title="Description" icon={<FileText size={13} />}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tool.description}</p>
        </Section>

        {/* Use case */}
        <Section title="Use Case" icon={<FileText size={13} />}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tool.useCase}</p>
        </Section>

        {/* Meta */}
        <Section title="Details" icon={<Shield size={13} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {[
              { k: 'Business Owner', v: tool.businessOwner },
              { k: 'Department',     v: tool.department },
              { k: 'License Type',   v: tool.licenseType },
              { k: 'Monthly Cost',   v: tool.monthlyCost > 0 ? `$${tool.monthlyCost.toLocaleString()}` : 'N/A' },
              { k: 'Monthly Users',  v: tool.monthlyUsers > 0 ? tool.monthlyUsers.toLocaleString() : 'N/A' },
              { k: 'Approved Date',  v: tool.approvedDate ?? 'N/A' },
              { k: 'Next Review',    v: tool.nextReviewDate },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Data residency */}
        <Section title="Data Residency" icon={<Globe size={13} />}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{tool.dataResidency}</div>
        </Section>

        {/* Data classification */}
        <Section title="Permitted Data Classifications" icon={<Shield size={13} />}>
          {tool.dataClassification.length > 0 ? tool.dataClassification.map(dc => (
            <span key={dc} style={{
              display: 'inline-block', margin: '2px 4px 2px 0',
              padding: '3px 10px', borderRadius: 4,
              background: `${DATA_CLASS_COLOR[dc]}22`, color: DATA_CLASS_COLOR[dc],
              fontSize: 12, fontWeight: 600,
            }}>{dc}</span>
          )) : <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>None — awaiting classification</span>}
        </Section>

        {/* Controls */}
        {tool.controls.length > 0 && (
          <Section title="Controls in Place" icon={<CheckCircle size={13} />}>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {tool.controls.map((c, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                  <CheckCircle size={13} color="var(--low)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Approval history */}
        <Section title="Approval History" icon={<History size={13} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {tool.approvalHistory.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', flexShrink: 0, marginTop: 3 }} />
                  {i < tool.approvalHistory.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4 }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{e.action}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.date}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    <strong>{e.actor}</strong> — {e.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: 'var(--text-secondary)' }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Main view ───────────────────────────────────────────────────────────────

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'approved',     label: 'Approved' },
  { key: 'pending',      label: 'Pending' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'prohibited',   label: 'Prohibited' },
];

export default function AIRegistryView() {
  const [tools, setTools]     = useState<AIRegistryTool[]>([]);
  const [stats, setStats]     = useState<AIRegistryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState<AIRegistryTool | null>(null);

  useEffect(() => {
    Promise.all([AIRegistryService.fetchAll(), AIRegistryService.fetchStats()])
      .then(([t, s]) => { setTools(t); setStats(s); })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: AIToolStatus) => {
    try {
      const updated = await AIRegistryService.changeStatus(id, status, 'Risk Officer', `Status changed to ${status}`);
      setTools(prev => prev.map(t => t.id === id ? updated : t));
      setSelected(updated);
      const s = await AIRegistryService.fetchStats();
      setStats(s);
    } catch (e) { console.error(e); }
  };

  const visible = tools.filter(t => {
    const matchStatus = filter === 'all' || t.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.vendor.toLowerCase().includes(q) || t.department.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) return <div className="view-container"><div style={{ color: 'var(--text-secondary)', padding: 32 }}>Loading registry…</div></div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1 className="view-title">GenAI Use-Case Registry</h1>
          <p className="view-subtitle">Inventory of all AI tools — approved, pending, and prohibited</p>
        </div>
      </div>

      {stats && <StatsBar stats={stats} />}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '5px 12px', borderRadius: 6, border: '1px solid',
                borderColor: filter === tab.key ? 'var(--cyan)' : 'var(--border)',
                background: filter === tab.key ? 'rgba(0,212,255,.08)' : 'transparent',
                color: filter === tab.key ? 'var(--cyan)' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px', flex: 1, maxWidth: 280 }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools…"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', width: '100%' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 90px 140px 80px 24px',
          gap: 16, padding: '9px 16px',
          background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)',
        }}>
          {['Tool / Vendor', 'Status', 'Risk', 'Data Class', 'Usage', ''].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</div>
          ))}
        </div>

        {visible.length === 0
          ? <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No tools match the current filter.</div>
          : visible.map(tool => (
              <ToolRow key={tool.id} tool={tool} onClick={() => setSelected(tool)} />
            ))
        }
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 99 }} />
          <DetailPanel tool={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
        </>
      )}
    </div>
  );
}
