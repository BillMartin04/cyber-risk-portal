import { useState } from 'react';
import {
  FileCheck, FileText, Shield, FileWarning,
  CheckCircle2, Wrench, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { EvidenceArtifact, EvidenceType, EvidenceStatus, AuditRating } from '../../models';

interface Props { artifacts: EvidenceArtifact[]; }

const TYPE_META: Record<EvidenceType, { label: string; color: string; icon: typeof FileCheck }> = {
  'test-result':        { label: 'Test Result',         color: 'var(--cyan)',     icon: FileCheck   },
  'attestation':        { label: 'Attestation',          color: 'var(--low)',      icon: CheckCircle2 },
  'assessment-report':  { label: 'Assessment Report',   color: 'var(--purple)',   icon: FileText    },
  'exception-approval': { label: 'Exception Approval',  color: 'var(--medium)',   icon: Shield      },
  'remediation-proof':  { label: 'Remediation Proof',   color: '#06b6d4',         icon: Wrench      },
  'audit-finding':      { label: 'Audit Finding',       color: 'var(--high)',     icon: FileWarning },
};

const STATUS_COLOR: Record<EvidenceStatus, string> = {
  'current':        'var(--low)',
  'superseded':     'var(--text-3)',
  'expired':        'var(--critical)',
  'pending-review': 'var(--medium)',
};

const RATING_COLOR: Record<AuditRating, string> = {
  'satisfactory':       'var(--low)',
  'needs-improvement':  'var(--medium)',
  'unsatisfactory':     'var(--critical)',
};

const TYPE_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'all',              label: 'All Types' },
  { value: 'test-result',      label: 'Test Results' },
  { value: 'attestation',      label: 'Attestations' },
  { value: 'assessment-report',label: 'Assessments' },
  { value: 'exception-approval',label: 'Exceptions' },
  { value: 'audit-finding',    label: 'Audit Findings' },
];

export default function EvidenceRegistryTable({ artifacts }: Props) {
  const [typeFilter, setTypeFilter]     = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expanded, setExpanded]         = useState<Set<string>>(new Set());

  const filtered = artifacts.filter(a => {
    if (typeFilter !== 'all'   && a.type   !== typeFilter)   return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="panel">
      <div className="panel-header" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="panel-title">Evidence Registry ({filtered.length})</div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              background: 'var(--card-elevated)', border: '1px solid var(--border-2)',
              color: 'var(--text)', borderRadius: 6, padding: '5px 10px', fontSize: 12,
            }}
          >
            {TYPE_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              background: 'var(--card-elevated)', border: '1px solid var(--border-2)',
              color: 'var(--text)', borderRadius: 6, padding: '5px 10px', fontSize: 12,
            }}
          >
            <option value="all">All Status</option>
            <option value="current">Current</option>
            <option value="pending-review">Pending Review</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 28 }} />
              <th>Artifact</th>
              <th>Type</th>
              <th>Status</th>
              <th>Author</th>
              <th>Reviewed</th>
              <th>Expiry</th>
              <th>Rating</th>
              <th>Regulatory</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(art => {
              const meta  = TYPE_META[art.type];
              const Icon  = meta.icon;
              const isOpen = expanded.has(art.id);
              const expiring = art.expiryDate
                ? (new Date(art.expiryDate).getTime() - Date.now()) / 86400000
                : null;
              return (
                <>
                  <tr
                    key={art.id}
                    onClick={() => toggle(art.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      {isOpen
                        ? <ChevronUp size={13} color="var(--text-3)" />
                        : <ChevronDown size={13} color="var(--text-3)" />}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={13} color={meta.color} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                          {art.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600,
                        background: `${meta.color}15`, color: meta.color,
                        border: `1px solid ${meta.color}30`,
                      }}>
                        {meta.label}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: STATUS_COLOR[art.status], textTransform: 'capitalize' }}>
                        {art.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{art.author}</td>
                    <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                      {art.reviewedDate
                        ? new Date(art.reviewedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                        : <span style={{ color: 'var(--medium)' }}>Pending</span>}
                    </td>
                    <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                      {art.expiryDate ? (
                        <span style={{ color: expiring !== null && expiring < 30 ? 'var(--high)' : 'var(--text-2)' }}>
                          {new Date(art.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {art.auditRating ? (
                        <span style={{ fontSize: 10, color: RATING_COLOR[art.auditRating], fontWeight: 600 }}>
                          {art.auditRating.replace('-', ' ')}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {art.regulatoryRef.slice(0, 2).map(r => (
                          <span key={r} style={{
                            fontSize: 9, padding: '1px 5px', borderRadius: 3,
                            background: 'var(--card-elevated)', color: 'var(--text-3)',
                            border: '1px solid var(--border)',
                          }}>{r.split(' ').slice(0, 2).join(' ')}</span>
                        ))}
                        {art.regulatoryRef.length > 2 && (
                          <span style={{ fontSize: 9, color: 'var(--text-3)' }}>+{art.regulatoryRef.length - 2}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${art.id}-detail`}>
                      <td colSpan={9} style={{ padding: 0 }}>
                        <div style={{
                          background: 'var(--card-elevated)', padding: '16px 52px',
                          borderBottom: '1px solid var(--border)',
                        }}>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 4 }}>
                              Summary
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>{art.summary}</div>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 4 }}>
                              Outcome / Conclusion
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7, fontWeight: 500 }}>{art.outcome}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 24, fontSize: 11, color: 'var(--text-3)' }}>
                            <span>Reviewer: <strong style={{ color: 'var(--text-2)' }}>{art.reviewer}</strong></span>
                            <span>Domains: <strong style={{ color: 'var(--text-2)' }}>{art.domainIds.join(', ')}</strong></span>
                            {art.regulatoryRef.length > 0 && (
                              <span>Refs: <strong style={{ color: 'var(--text-2)' }}>{art.regulatoryRef.join(' · ')}</strong></span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
