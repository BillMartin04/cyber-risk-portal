import { useEffect, useState } from 'react';
import { Globe, AlertTriangle, X, ChevronRight, Shield, CheckCircle, XCircle, HelpCircle, Search } from 'lucide-react';
import { DataSovereigntyService } from '../services/DataSovereigntyService';
import type { DataSovereigntyEntry, DataSovereigntyStats, SovereigntyRisk, ComplianceStatus, DataRegion } from '../repositories/DataSovereigntyRepository';

// ─── helpers ────────────────────────────────────────────────────────────────

const RISK_COLOR: Record<SovereigntyRisk, string> = {
  critical: 'var(--critical)',
  high:     'var(--high)',
  medium:   'var(--medium)',
  low:      'var(--low)',
  none:     'var(--text-muted)',
};

const REGION_META: Record<DataRegion, { label: string; flag: string; law: string }> = {
  us:      { label: 'United States', flag: '🇺🇸', law: 'CCPA / FedRAMP' },
  eu:      { label: 'European Union', flag: '🇪🇺', law: 'GDPR' },
  uk:      { label: 'United Kingdom', flag: '🇬🇧', law: 'UK GDPR' },
  apac:    { label: 'Asia-Pacific',   flag: '🌏', law: 'Various' },
  cn:      { label: 'China (PRC)',    flag: '🇨🇳', law: 'PIPL / NSL' },
  unknown: { label: 'Unknown',        flag: '❓', law: 'Unverified' },
};

const COMPLIANCE_CONFIG: Record<ComplianceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  compliant:     { label: 'Compliant',     color: 'var(--low)',      icon: <CheckCircle size={12} /> },
  adequate:      { label: 'Adequate',      color: 'var(--low)',      icon: <CheckCircle size={12} /> },
  'non-compliant': { label: 'Non-Compliant', color: 'var(--critical)', icon: <XCircle size={12} /> },
  unknown:       { label: 'Unknown',       color: 'var(--medium)',   icon: <HelpCircle size={12} /> },
};

function CompliancePill({ status }: { status: ComplianceStatus }) {
  const cfg = COMPLIANCE_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 7px', borderRadius: 20,
      background: `${cfg.color}18`, color: cfg.color,
      fontSize: 10, fontWeight: 700,
    }}>{cfg.icon} {cfg.label}</span>
  );
}

function RiskBadge({ risk }: { risk: SovereigntyRisk }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4,
      background: `${RISK_COLOR[risk]}18`, color: RISK_COLOR[risk],
      fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
    }}>{risk}</span>
  );
}

function BoolIcon({ val }: { val: boolean }) {
  return val
    ? <CheckCircle size={14} color="var(--low)" />
    : <XCircle size={14} color="var(--critical)" />;
}

// ─── Region summary cards ────────────────────────────────────────────────────

function RegionCard({ region, entries }: { region: DataRegion; entries: DataSovereigntyEntry[] }) {
  const meta = REGION_META[region];
  const critical = entries.filter(e => e.sovereigntyRisk === 'critical').length;
  const high     = entries.filter(e => e.sovereigntyRisk === 'high').length;

  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{meta.flag}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{meta.label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{meta.law}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 800, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
          {entries.length}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {critical > 0 && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(239,68,68,.12)', color: 'var(--critical)', fontWeight: 700 }}>
            {critical} critical
          </span>
        )}
        {high > 0 && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(245,158,11,.12)', color: 'var(--high)', fontWeight: 700 }}>
            {high} high
          </span>
        )}
        {critical === 0 && high === 0 && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(34,197,94,.12)', color: 'var(--low)', fontWeight: 700 }}>
            no critical risk
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Stats bar ───────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: DataSovereigntyStats }) {
  const tiles = [
    { label: 'Tools Assessed',      value: stats.total,            color: 'var(--text-secondary)' },
    { label: 'Critical Risk',       value: stats.criticalRisk,     color: 'var(--critical)' },
    { label: 'High Risk',           value: stats.highRisk,         color: 'var(--high)' },
    { label: 'Cross-Border Flows',  value: stats.crossBorderCount, color: 'var(--medium)' },
    { label: 'GDPR Compliant',      value: stats.gdprCompliant,    color: 'var(--low)' },
    { label: 'Unknown Residency',   value: stats.unknownResidency, color: 'var(--high)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
      {tiles.map(t => (
        <div key={t.label} className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: t.color, fontVariantNumeric: 'tabular-nums' }}>{t.value}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Table row ───────────────────────────────────────────────────────────────

function EntryRow({ entry, onClick }: { entry: DataSovereigntyEntry; onClick: () => void }) {
  const meta = REGION_META[entry.region];
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 140px 90px 80px 80px 80px 24px',
        alignItems: 'center', gap: 12, padding: '11px 16px',
        borderBottom: '1px solid var(--border)', cursor: 'pointer',
        transition: 'background .1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{entry.toolName}</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{entry.vendor}</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        <span style={{ marginRight: 5 }}>{meta.flag}</span>{entry.dataResidency}
      </div>
      <RiskBadge risk={entry.sovereigntyRisk} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BoolIcon val={!entry.crossBorderTransfer} />
      </div>
      <CompliancePill status={entry.compliance.gdpr} />
      <CompliancePill status={entry.compliance.apra} />
      <ChevronRight size={14} color="var(--text-muted)" />
    </div>
  );
}

// ─── Detail panel ────────────────────────────────────────────────────────────

function DetailPanel({ entry, onClose }: { entry: DataSovereigntyEntry; onClose: () => void }) {
  const meta = REGION_META[entry.region];
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 500,
      background: 'var(--surface)', borderLeft: '1px solid var(--border)',
      zIndex: 100, overflowY: 'auto', boxShadow: '-4px 0 24px rgba(0,0,0,.15)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{entry.toolName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{entry.vendor}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <RiskBadge risk={entry.sovereigntyRisk} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{meta.flag} {entry.dataResidency}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* Critical warning */}
        {(entry.sovereigntyRisk === 'critical') && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', marginBottom: 20, display: 'flex', gap: 10 }}>
            <AlertTriangle size={16} color="var(--critical)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{entry.notes}</div>
          </div>
        )}

        {/* Compliance grid */}
        <DSection title="Regulatory Compliance" icon={<Shield size={13} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'GDPR (EU)',   status: entry.compliance.gdpr },
              { label: 'UK GDPR',     status: entry.compliance.ukGdpr },
              { label: 'CCPA (US)',   status: entry.compliance.ccpa },
              { label: 'APRA (AU)',   status: entry.compliance.apra },
            ].map(({ label, status }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--surface-hover)', borderRadius: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                <CompliancePill status={status} />
              </div>
            ))}
          </div>
        </DSection>

        {/* Residency & processing */}
        <DSection title="Data Residency & Processing" icon={<Globe size={13} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {[
              { k: 'Primary Residency',    v: `${meta.flag} ${entry.dataResidency}` },
              { k: 'Applicable Law',       v: meta.law },
              { k: 'Cross-Border Transfer',v: entry.crossBorderTransfer ? 'Yes ⚠️' : 'No ✓' },
              { k: 'Third-Party Sharing',  v: entry.thirdPartySharing ? 'Yes ⚠️' : 'No ✓' },
              { k: 'Retention Period',     v: entry.retentionPeriod },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          {entry.processingRegions.length > 1 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>All Processing Regions</div>
              {entry.processingRegions.map(r => (
                <span key={r} style={{ display: 'inline-block', margin: '2px 4px 2px 0', padding: '2px 8px', borderRadius: 4, background: 'var(--surface-hover)', fontSize: 12, color: 'var(--text-secondary)' }}>{r}</span>
              ))}
            </div>
          )}
        </DSection>

        {/* Encryption */}
        <DSection title="Security Controls" icon={<Shield size={13} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Encryption in Transit', val: entry.encryptionInTransit },
              { label: 'Encryption at Rest',    val: entry.encryptionAtRest },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--surface-hover)', borderRadius: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                <BoolIcon val={val} />
              </div>
            ))}
          </div>
          {entry.transferMechanisms.length > 0 && entry.transferMechanisms[0] !== 'None — public platform' && entry.transferMechanisms[0] !== 'None compliant with Western data protection law' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Transfer Mechanisms</div>
              {entry.transferMechanisms.map(m => (
                <div key={m} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '3px 0' }}>• {m}</div>
              ))}
            </div>
          )}
        </DSection>

        {/* Certifications */}
        {entry.certifications.length > 0 && (
          <DSection title="Certifications" icon={<CheckCircle size={13} />}>
            {entry.certifications.map(c => (
              <div key={c} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <CheckCircle size={13} color="var(--low)" />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c}</span>
              </div>
            ))}
          </DSection>
        )}

        {/* Data types */}
        <DSection title="Data Types Processed" icon={<Globe size={13} />}>
          {entry.dataTypesProcessed.map(d => (
            <span key={d} style={{ display: 'inline-block', margin: '2px 4px 2px 0', padding: '2px 8px', borderRadius: 4, background: 'var(--surface-hover)', fontSize: 12, color: 'var(--text-secondary)' }}>{d}</span>
          ))}
        </DSection>

        {/* Notes */}
        {entry.sovereigntyRisk !== 'critical' && (
          <DSection title="Assessment Notes" icon={<Shield size={13} />}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{entry.notes}</p>
          </DSection>
        )}
      </div>
    </div>
  );
}

function DSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
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

const RISK_FILTERS: { key: string; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'high',     label: 'High' },
  { key: 'medium',   label: 'Medium' },
  { key: 'low',      label: 'Low' },
];

export default function DataSovereigntyView() {
  const [entries, setEntries] = useState<DataSovereigntyEntry[]>([]);
  const [stats,   setStats]   = useState<DataSovereigntyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [selected, setSelected] = useState<DataSovereigntyEntry | null>(null);

  useEffect(() => {
    Promise.all([DataSovereigntyService.fetchAll(), DataSovereigntyService.fetchStats()])
      .then(([e, s]) => { setEntries(e); setStats(s); })
      .finally(() => setLoading(false));
  }, []);

  const visible = entries.filter(e => {
    const matchRisk   = filter === 'all' || e.sovereigntyRisk === filter;
    const q           = search.toLowerCase();
    const matchSearch = !q || e.toolName.toLowerCase().includes(q) || e.dataResidency.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q);
    return matchRisk && matchSearch;
  });

  // Group by region for summary cards
  const regions: DataRegion[] = ['us', 'eu', 'uk', 'cn', 'apac', 'unknown'];
  const byRegion = (r: DataRegion) => entries.filter(e => e.region === r);

  if (loading) return <div className="view-container"><div style={{ color: 'var(--text-secondary)', padding: 32 }}>Loading data sovereignty assessment…</div></div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1 className="view-title">Data Sovereignty Panel</h1>
          <p className="view-subtitle">Data residency, cross-border flows, and regulatory compliance per AI tool</p>
        </div>
      </div>

      {stats && <StatsBar stats={stats} />}

      {/* Region summary */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Data Residency by Region</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {regions.filter(r => byRegion(r).length > 0).map(r => (
            <RegionCard key={r} region={r} entries={byRegion(r)} />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {RISK_FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '5px 12px', borderRadius: 6, border: '1px solid',
              borderColor: filter === f.key ? 'var(--cyan)' : 'var(--border)',
              background: filter === f.key ? 'rgba(0,212,255,.08)' : 'transparent',
              color: filter === f.key ? 'var(--cyan)' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px', flex: 1, maxWidth: 260 }}>
          <Search size={13} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools…" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', width: '100%' }} />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 140px 90px 80px 80px 80px 24px',
          gap: 12, padding: '9px 16px',
          background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)',
        }}>
          {['Tool', 'Residency', 'Sovereignty Risk', 'No Cross-Border', 'GDPR', 'APRA', ''].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</div>
          ))}
        </div>

        {visible.length === 0
          ? <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No entries match the filter.</div>
          : visible.map(e => <EntryRow key={e.id} entry={e} onClick={() => setSelected(e)} />)
        }
      </div>

      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 99 }} />
          <DetailPanel entry={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  );
}
