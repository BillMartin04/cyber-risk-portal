import { useState } from 'react';
import {
  UserCheck, Users, ShieldAlert, AlertTriangle, Key, Bot,
  Globe, RefreshCw, Search, ChevronRight, Lock, Unlock,
  CheckCircle2, XCircle, Clock, Shield,
} from 'lucide-react';
import { useIdentity } from '../controllers/useIdentity';
import type { Identity, IdentityType, IdentityStatus, AccessLevel } from '../models';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<IdentityType, typeof Users> = {
  'human':          Users,
  'service-account': Bot,
  'machine':        Shield,
  'third-party':    Globe,
  'api-key':        Key,
};

const TYPE_COLOR: Record<IdentityType, string> = {
  'human':          'var(--cyan)',
  'service-account':'var(--purple)',
  'machine':        '#f59e0b',
  'third-party':    '#ec4899',
  'api-key':        '#6366f1',
};

const STATUS_CONFIG: Record<IdentityStatus, { label: string; color: string }> = {
  active:     { label: 'Active',     color: 'var(--low)' },
  suspended:  { label: 'Suspended',  color: 'var(--critical)' },
  pending:    { label: 'Pending',    color: 'var(--medium)' },
  offboarded: { label: 'Offboarded', color: 'var(--text-muted)' },
  expired:    { label: 'Expired',    color: 'var(--high)' },
};

const ACCESS_CONFIG: Record<AccessLevel, { label: string; color: string }> = {
  full:        { label: 'Full',        color: 'var(--critical)' },
  'read-write':{ label: 'Read-Write',  color: 'var(--medium)' },
  'read-only': { label: 'Read-Only',   color: 'var(--low)' },
  restricted:  { label: 'Restricted',  color: 'var(--high)' },
  none:        { label: 'None',        color: 'var(--text-muted)' },
};

function riskColor(score: number) {
  if (score >= 60) return 'var(--critical)';
  if (score >= 40) return 'var(--high)';
  if (score >= 20) return 'var(--medium)';
  return 'var(--low)';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isOverdue(iso: string) {
  return new Date(iso) < new Date();
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: number | string; sub?: string;
  color: string; icon: typeof Users;
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '14px 18px', display: 'flex',
      alignItems: 'center', gap: 14, flex: '1 1 160px', minWidth: 130,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: IdentityType }) {
  const Icon = TYPE_ICON[type];
  const color = TYPE_COLOR[type];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 4,
      background: `${color}18`, color,
      fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
    }}>
      <Icon size={10} />
      {type.replace('-', ' ')}
    </span>
  );
}

function StatusBadge({ status }: { status: IdentityStatus }) {
  const { label, color } = STATUS_CONFIG[status];
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4,
      background: `${color}18`, color,
      fontSize: 11, fontWeight: 600,
    }}>{label}</span>
  );
}

function AccessBadge({ access }: { access: AccessLevel }) {
  const { label, color } = ACCESS_CONFIG[access];
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 4,
      background: `${color}18`, color,
      fontSize: 10, fontWeight: 600,
    }}>{label}</span>
  );
}

function RiskBar({ score }: { score: number }) {
  const color = riskColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 60, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{score}</span>
    </div>
  );
}

function IdentityDetail({ identity, onClose }: { identity: Identity; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
      background: 'var(--bg)', borderLeft: '1px solid var(--border)',
      overflowY: 'auto', zIndex: 100, padding: 24,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{identity.displayName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{identity.email}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <TypeBadge type={identity.type} />
            <StatusBadge status={identity.status} />
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--text-muted)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12,
        }}>Close</button>
      </div>

      {/* Risk score */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 8, padding: 14, marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Identity Risk Score</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: riskColor(identity.riskScore) }}>
            {identity.riskScore}<span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/100</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Access Level</div>
          <AccessBadge access={identity.accessLevel} />
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            {identity.privileged ? (
              <span style={{ color: 'var(--critical)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldAlert size={11} /> Privileged
              </span>
            ) : 'Standard'}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 8, padding: 14, marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Identity Details
        </div>
        {[
          ['Role',        identity.role.replace('-', ' ').toUpperCase()],
          ['Department',  identity.department],
          ['MFA',         identity.mfaEnabled ? '✓ Enabled' : '✗ Not Enabled'],
          ['Last Login',  formatDate(identity.lastLogin)],
          ['Reviewed',    formatDate(identity.reviewedAt)],
          ['Next Review', formatDate(identity.nextReview)],
          ...(identity.expiresAt ? [['Expires', formatDate(identity.expiresAt)]] : []),
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
            <span style={{
              fontSize: 12, fontWeight: 500,
              color: k === 'MFA' ? (identity.mfaEnabled ? 'var(--low)' : 'var(--critical)') :
                     k === 'Next Review' && isOverdue(identity.nextReview) ? 'var(--high)' : 'var(--text)',
            }}>{v}</span>
          </div>
        ))}
        {isOverdue(identity.nextReview) && (
          <div style={{
            marginTop: 8, padding: '6px 10px', borderRadius: 6,
            background: 'var(--high)18', color: 'var(--high)',
            fontSize: 11, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <AlertTriangle size={11} /> Access review is overdue
          </div>
        )}
      </div>

      {/* Domain permissions */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 8, padding: 14, marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Domain Permissions
        </div>
        {identity.domainPermissions.map(dp => (
          <div key={dp.domainId} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 12, color: dp.access === 'none' ? 'var(--text-muted)' : 'var(--text)' }}>
              {dp.domainName}
            </span>
            <AccessBadge access={dp.access} />
          </div>
        ))}
      </div>

      {/* Tags */}
      {identity.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {identity.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 8px', borderRadius: 4,
              background: 'var(--surface)', border: '1px solid var(--border)',
              fontSize: 10, color: 'var(--text-muted)',
            }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function IdentityView() {
  const [activeTab, setActiveTab] = useState<'identities' | 'access-review'>('identities');
  const {
    filtered, stats, accessReview, selected, loading, error,
    filterType, filterStatus, searchQuery,
    setSelected, setFilterType, setFilterStatus, setSearchQuery, refresh,
  } = useIdentity();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--text-muted)', gap: 10 }}>
      <RefreshCw size={16} className="spin" /> Loading identities…
    </div>
  );

  if (error) return (
    <div style={{ padding: 32, color: 'var(--high)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <AlertTriangle size={16} /> {error}
    </div>
  );

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1300, position: 'relative' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserCheck size={20} color="var(--cyan)" />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Identity Management</h1>
          <button onClick={refresh} style={{
            marginLeft: 'auto', background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 6, padding: '5px 12px',
            cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
          Manage and review all human, machine, and service identities and their domain access rights.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <StatCard label="Total Identities" value={stats.total}       color="var(--cyan)"     icon={Users} />
          <StatCard label="Active"           value={stats.active}      color="var(--low)"      icon={CheckCircle2} />
          <StatCard label="Suspended"        value={stats.suspended}   color="var(--critical)" icon={XCircle} />
          <StatCard label="Privileged"       value={stats.privileged}  color="var(--high)"     icon={ShieldAlert} />
          <StatCard label="MFA Coverage"     value={`${stats.mfaCoverage}%`} sub="of human identities" color="var(--purple)" icon={Lock} />
          <StatCard label="Review Overdue"   value={stats.reviewOverdue} color="var(--medium)"  icon={Clock} />
          <StatCard label="High Risk"        value={stats.highRisk}    color="var(--critical)" icon={AlertTriangle} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {(['identities', 'access-review'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', padding: '8px 18px',
            fontSize: 13, cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400,
            color: activeTab === tab ? 'var(--cyan)' : 'var(--text-muted)',
            borderBottom: activeTab === tab ? '2px solid var(--cyan)' : '2px solid transparent',
            marginBottom: -1,
          }}>
            {tab === 'identities' ? `All Identities (${filtered.length})` : `Access Review Queue (${accessReview.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'identities' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, email, role…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 6, padding: '7px 10px 7px 30px',
                  color: 'var(--text)', fontSize: 13,
                }}
              />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value as any)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '7px 12px', color: 'var(--text)', fontSize: 13,
            }}>
              <option value="all">All Types</option>
              <option value="human">Human</option>
              <option value="service-account">Service Account</option>
              <option value="machine">Machine</option>
              <option value="third-party">Third-Party</option>
              <option value="api-key">API Key</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '7px 12px', color: 'var(--text)', fontSize: 13,
            }}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="offboarded">Offboarded</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Identity table */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['Identity', 'Type', 'Role', 'Status', 'Access', 'MFA', 'Risk Score', 'Next Review', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      No identities match current filters.
                    </td>
                  </tr>
                ) : filtered.map((id, i) => (
                  <tr key={id.id} style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    background: selected?.id === id.id ? 'var(--border)18' : 'transparent',
                    cursor: 'pointer',
                  }} onClick={() => setSelected(selected?.id === id.id ? null : id)}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{id.displayName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{id.email}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{id.department}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}><TypeBadge type={id.type} /></td>
                    <td style={{ padding: '10px 14px', color: 'var(--text)', textTransform: 'capitalize', fontSize: 12 }}>
                      {id.role.replace('-', ' ')}
                      {id.privileged && <span style={{ marginLeft: 4, color: 'var(--critical)', fontSize: 10 }}>★</span>}
                    </td>
                    <td style={{ padding: '10px 14px' }}><StatusBadge status={id.status} /></td>
                    <td style={{ padding: '10px 14px' }}><AccessBadge access={id.accessLevel} /></td>
                    <td style={{ padding: '10px 14px' }}>
                      {id.mfaEnabled
                        ? <CheckCircle2 size={14} color="var(--low)" />
                        : <XCircle size={14} color="var(--critical)" />}
                    </td>
                    <td style={{ padding: '10px 14px' }}><RiskBar score={id.riskScore} /></td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 12, color: isOverdue(id.nextReview) ? 'var(--high)' : 'var(--text-muted)' }}>
                        {isOverdue(id.nextReview) && <AlertTriangle size={10} style={{ marginRight: 3 }} />}
                        {formatDate(id.nextReview)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <ChevronRight size={14} color="var(--text-muted)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'access-review' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {accessReview.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--low)' }}>
              <CheckCircle2 size={28} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>All access reviews are up to date</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['Identity', 'Domain', 'Current Access', 'Last Used', 'Recommended', 'Reason'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accessReview.map((item, i) => (
                  <tr key={`${item.identityId}-${item.domainId}`} style={{
                    borderBottom: i < accessReview.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.displayName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.email}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text)', fontSize: 12 }}>{item.domainName}</td>
                    <td style={{ padding: '10px 14px' }}><AccessBadge access={item.currentAccess} /></td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(item.lastUsed)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>→</span>
                        <AccessBadge access={item.recommended} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--high)', maxWidth: 260 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                        <AlertTriangle size={11} style={{ marginTop: 1, flexShrink: 0 }} />
                        {item.reason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <IdentityDetail identity={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
