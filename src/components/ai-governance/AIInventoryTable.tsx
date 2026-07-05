import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, AlertCircle, XCircle, Clock, Eye } from 'lucide-react';
import type { AIModel, AIDeploymentStatus, AIApprovalStatus } from '../../models';

interface Props {
  models: AIModel[];
}

function TierBadge({ tier }: { tier: AIModel['riskTier'] }) {
  const styles: Record<string, { bg: string; color: string }> = {
    critical: { bg: 'var(--critical-10)', color: 'var(--critical)' },
    high:     { bg: 'var(--high-10)',     color: 'var(--high)'     },
    medium:   { bg: 'var(--medium-10)',   color: 'var(--medium)'   },
    low:      { bg: 'var(--low-10)',      color: 'var(--low)'      },
  };
  const s = styles[tier];
  return (
    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.4px', ...s }}>
      {tier}
    </span>
  );
}

function ApprovalChip({ status }: { status: AIApprovalStatus }) {
  const map: Record<AIApprovalStatus, { label: string; color: string }> = {
    'approved':            { label: 'Approved',       color: 'var(--low)'      },
    'approved-conditions': { label: 'Cond. Approved', color: 'var(--medium)'   },
    'pending':             { label: 'Pending',         color: 'var(--text-3)'  },
    'under-review':        { label: 'Under Review',    color: 'var(--cyan)'    },
    'rejected':            { label: 'Rejected',        color: 'var(--critical)' },
  };
  const { label, color } = map[status];
  return <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>;
}

function DeploymentChip({ status }: { status: AIDeploymentStatus }) {
  const map: Record<AIDeploymentStatus, { label: string; color: string }> = {
    'production': { label: 'Production', color: 'var(--low)'      },
    'pilot':      { label: 'Pilot',      color: 'var(--cyan)'     },
    'review':     { label: 'In Review',  color: 'var(--medium)'   },
    'retired':    { label: 'Retired',    color: 'var(--text-3)'   },
    'blocked':    { label: 'Blocked',    color: 'var(--critical)' },
  };
  const { label, color } = map[status];
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4,
      background: `${color}18`, color, border: `1px solid ${color}30`, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function TestResultDots({ results }: { results: AIModel['testResults'] }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {results.map(t => {
        const color = t.result === 'pass'       ? 'var(--low)'
                    : t.result === 'fail'       ? 'var(--critical)'
                    : t.result === 'partial'    ? 'var(--medium)'
                    : 'var(--text-3)';
        const Icon  = t.result === 'pass'       ? CheckCircle2
                    : t.result === 'fail'       ? XCircle
                    : t.result === 'partial'    ? AlertCircle
                    : Clock;
        return (
          <span key={t.testName} title={`${t.testName}: ${t.result}`} style={{ display: 'inline-flex' }}>
            <Icon size={13} color={color} />
          </span>
        );
      })}
    </div>
  );
}

function ExpandedRow({ model }: { model: AIModel }) {
  return (
    <tr>
      <td colSpan={10} style={{ padding: 0 }}>
        <div className="ai-expanded-row">
          <div className="ai-expanded-section">
            <div className="ai-expanded-label">Description</div>
            <div className="ai-expanded-text">{model.description}</div>
          </div>
          <div className="ai-expanded-section">
            <div className="ai-expanded-label">Data Categories</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {model.dataCategories.map(d => (
                <span key={d} className="data-tag">{d}</span>
              ))}
            </div>
          </div>
          <div className="ai-expanded-section">
            <div className="ai-expanded-label">OWASP LLM Threats</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {model.owaspThreats.length > 0
                ? model.owaspThreats.map(t => <span key={t} className="owasp-tag">{t}</span>)
                : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>None identified</span>}
            </div>
          </div>
          <div className="ai-expanded-section">
            <div className="ai-expanded-label">Test Results</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {model.testResults.map(t => {
                const color = t.result === 'pass' ? 'var(--low)' : t.result === 'fail' ? 'var(--critical)' : t.result === 'partial' ? 'var(--medium)' : 'var(--text-3)';
                return (
                  <div key={t.testName} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                    <span style={{ color, fontWeight: 700, width: 70, textTransform: 'uppercase', fontSize: 10 }}>
                      {t.result}
                    </span>
                    <span style={{ color: 'var(--text-2)' }}>{t.testName}</span>
                    {t.score !== undefined && (
                      <span style={{ fontFamily: 'JetBrains Mono', color, fontSize: 11 }}>{t.score}%</span>
                    )}
                    {t.notes && (
                      <span style={{ color: 'var(--text-3)', fontSize: 11 }}>— {t.notes}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ai-expanded-section">
            <div className="ai-expanded-label">Regulatory References</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {model.regulatoryRefs.map(r => <span key={r} className="reg-tag">{r}</span>)}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AIInventoryTable({ models }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="ai-table-wrap">
      <div className="ai-table-header">
        <div className="panel-title">
          <Eye size={14} color="var(--purple)" />
          AI Model Inventory — {models.length} systems registered
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Click a row to expand details</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 28 }}></th>
              <th>System</th>
              <th>Type</th>
              <th>Vendor</th>
              <th>Risk Tier</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Human Oversight</th>
              <th>Tests</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => {
              const isOpen = expanded.has(model.id);
              return (
                <>
                  <tr
                    key={model.id}
                    className="clickable"
                    onClick={() => toggle(model.id)}
                  >
                    <td>
                      {isOpen
                        ? <ChevronDown size={13} color="var(--cyan)" />
                        : <ChevronRight size={13} color="var(--text-3)" />}
                    </td>
                    <td>
                      <div className="risk-name">{model.name}</div>
                      <div className="risk-owner">{model.shortName} · {model.businessOwner}</div>
                    </td>
                    <td>
                      <span className={`ai-type-badge ${model.modelType}`}>
                        {model.modelType.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      {model.vendor}
                      {model.vendorProduct && (
                        <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{model.vendorProduct}</div>
                      )}
                    </td>
                    <td><TierBadge tier={model.riskTier} /></td>
                    <td><DeploymentChip status={model.deploymentStatus} /></td>
                    <td><ApprovalChip status={model.approvalStatus} /></td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                        color: model.humanOversight === 'full'    ? 'var(--low)'
                             : model.humanOversight === 'partial' ? 'var(--medium)'
                             : 'var(--critical)',
                      }}>
                        {model.humanOversight}
                      </span>
                    </td>
                    <td><TestResultDots results={model.testResults} /></td>
                    <td>
                      {model.openIssues > 0
                        ? <span style={{ color: 'var(--high)', fontWeight: 700, fontSize: 13, fontFamily: 'JetBrains Mono' }}>{model.openIssues}</span>
                        : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
                    </td>
                  </tr>
                  {isOpen && <ExpandedRow key={`${model.id}-exp`} model={model} />}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
