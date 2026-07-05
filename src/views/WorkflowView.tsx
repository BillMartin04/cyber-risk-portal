import { useState } from 'react';
import {
  GitBranch, Plus, CheckCircle2, XCircle, Clock, AlertTriangle,
  ChevronRight, RefreshCw, User, ArrowRight, Shield, Brain,
} from 'lucide-react';
import { useWorkflow } from '../controllers/useWorkflow';
import type { WorkflowInstance, WorkflowDefinition, StartWorkflowRequest } from '../models';

// ── Stage order for each workflow definition ──────────────────────────────────
const STAGE_ORDER: Record<string, string[]> = {
  'ai-intake': [
    'draft', 'security-review', 'legal-review',
    'privacy-review', 'governance-board', 'conditional-approval',
  ],
  'risk-exception': [
    'draft', 'risk-owner-review', 'ciso-review', 'cro-review',
  ],
};

const TERMINAL_STATES = ['approved', 'rejected', 'cancelled'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active:    { color: 'var(--cyan)',     label: 'Active'    },
  completed: { color: 'var(--low)',      label: 'Approved'  },
  rejected:  { color: 'var(--critical)', label: 'Rejected'  },
  cancelled: { color: 'var(--text-muted)', label: 'Cancelled' },
};

const EVENT_CONFIG: Record<string, { color: string; label: string }> = {
  APPROVE: { color: 'var(--low)',      label: 'Approve'          },
  APPROVE_SECURITY: { color: 'var(--low)', label: 'Approve — Security' },
  APPROVE_LEGAL:    { color: 'var(--low)', label: 'Approve — Legal'    },
  APPROVE_PRIVACY:  { color: 'var(--low)', label: 'Approve — Privacy'  },
  FINAL_APPROVE:    { color: 'var(--low)', label: 'Final Approve'       },
  CONDITIONAL:      { color: 'var(--medium)', label: 'Conditional'      },
  CONDITIONS_MET:   { color: 'var(--low)', label: 'Conditions Met'      },
  SUBMIT:           { color: 'var(--cyan)', label: 'Submit'             },
  ESCALATE:         { color: 'var(--medium)', label: 'Escalate to CRO'  },
  REJECT:           { color: 'var(--critical)', label: 'Reject'         },
  REJECT_SECURITY:  { color: 'var(--critical)', label: 'Reject — Security' },
  REJECT_LEGAL:     { color: 'var(--critical)', label: 'Reject — Legal'    },
  REJECT_PRIVACY:   { color: 'var(--critical)', label: 'Reject — Privacy'  },
  FINAL_REJECT:     { color: 'var(--critical)', label: 'Final Reject'       },
  CONDITIONS_FAIL:  { color: 'var(--critical)', label: 'Conditions Not Met' },
  REVOKE:           { color: 'var(--critical)', label: 'Revoke'             },
  REQUEST_CHANGES:  { color: 'var(--high)',     label: 'Request Changes'    },
  CANCEL:           { color: 'var(--text-muted)', label: 'Cancel'           },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function stateLabel(def: WorkflowDefinition | undefined, state: string): string {
  return def?.states[state]?.label ?? state.replace(/-/g, ' ');
}

// ── Stage Tracker ─────────────────────────────────────────────────────────────
function StageTracker({ instance, definition, compact = false }: {
  instance: WorkflowInstance;
  definition?: WorkflowDefinition;
  compact?: boolean;
}) {
  const defId   = instance.definitionId;
  const stages  = STAGE_ORDER[defId] ?? [];
  const current = instance.currentState;
  const isDone  = TERMINAL_STATES.includes(current);
  const curIdx  = stages.indexOf(current);

  const dotSize = compact ? 22 : 30;
  const lineH   = compact ? 2 : 3;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
      {stages.map((stage, i) => {
        const isPast    = isDone || i < curIdx;
        const isNow     = !isDone && stage === current;
        const isFuture  = !isDone && i > curIdx;
        const color     = isPast ? 'var(--low)' : isNow ? 'var(--cyan)' : 'var(--border)';
        const label     = definition?.states[stage]?.label ?? stage.replace(/-/g, ' ');

        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: dotSize, height: dotSize, borderRadius: '50%',
                background: isPast ? 'var(--low)' : isNow ? 'var(--cyan)' : 'var(--bg)',
                border: `${lineH}px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isNow ? `0 0 10px var(--cyan)66` : 'none',
                transition: 'all 0.3s',
              }}>
                {isPast && <CheckCircle2 size={compact ? 11 : 14} color="var(--bg)" strokeWidth={3} />}
                {isNow  && <div style={{ width: compact ? 6 : 8, height: compact ? 6 : 8, borderRadius: '50%', background: '#000' }} />}
              </div>
              {!compact && (
                <div style={{
                  fontSize: 9, color: isPast ? 'var(--low)' : isNow ? 'var(--cyan)' : 'var(--text-muted)',
                  textAlign: 'center', maxWidth: 64, lineHeight: 1.3, fontWeight: isNow ? 700 : 400,
                }}>{label}</div>
              )}
            </div>
            {i < stages.length - 1 && (
              <div style={{
                width: compact ? 20 : 32, height: lineH,
                background: isPast ? 'var(--low)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}

      {/* Terminal state indicator */}
      {isDone && (
        <>
          <div style={{ width: compact ? 20 : 32, height: lineH, background: current === 'approved' ? 'var(--low)' : 'var(--critical)' }} />
          <div style={{
            padding: compact ? '2px 7px' : '4px 10px', borderRadius: 20,
            background: current === 'approved' ? 'var(--low)22' : current === 'rejected' ? 'var(--critical)22' : 'var(--border)',
            border: `2px solid ${current === 'approved' ? 'var(--low)' : current === 'rejected' ? 'var(--critical)' : 'var(--text-muted)'}`,
            fontSize: compact ? 9 : 11, fontWeight: 700,
            color: current === 'approved' ? 'var(--low)' : current === 'rejected' ? 'var(--critical)' : 'var(--text-muted)',
          }}>
            {current.toUpperCase()}
          </div>
        </>
      )}
    </div>
  );
}

// ── New Workflow Modal ─────────────────────────────────────────────────────────
function NewWorkflowModal({ definitionId, onSubmit, onClose }: {
  definitionId: string;
  onSubmit: (req: StartWorkflowRequest) => Promise<void>;
  onClose: () => void;
}) {
  const isAI = definitionId === 'ai-intake';
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    name: '', createdBy: 'analyst@org.internal',
    vendor: '', useCase: '', dataClass: 'internal',
    controlId: '', justification: '', compensating: '', expiryDate: '',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        definitionId,
        name: form.name,
        createdBy: form.createdBy,
        context: isAI
          ? { vendor: form.vendor, useCase: form.useCase, dataClassification: form.dataClass }
          : { controlId: form.controlId, justification: form.justification, compensatingControls: form.compensating, expiryDate: form.expiryDate },
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const,
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontSize: 13,
  };
  const labelStyle = { fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' as const };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 28, width: 520, maxWidth: '95vw',
        boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          {isAI ? <Brain size={18} color="var(--purple)" /> : <Shield size={18} color="var(--cyan)" />}
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              {isAI ? 'New AI Use-Case Intake' : 'New Risk Exception Request'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {isAI ? 'Submit an AI tool or use case for governance review' : 'Request a control exception with compensating controls'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>{isAI ? 'AI Tool / Use-Case Name *' : 'Exception Title *'}</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle}
              placeholder={isAI ? 'e.g. ChatGPT Enterprise — Code Review Assistant' : 'e.g. Exception: Quarterly PAM Review (was Monthly)'} />
          </div>

          <div>
            <label style={labelStyle}>Submitted By *</label>
            <input value={form.createdBy} onChange={e => set('createdBy', e.target.value)} style={inputStyle} />
          </div>

          {isAI ? (
            <>
              <div>
                <label style={labelStyle}>Vendor</label>
                <input value={form.vendor} onChange={e => set('vendor', e.target.value)} style={inputStyle} placeholder="e.g. OpenAI Inc." />
              </div>
              <div>
                <label style={labelStyle}>Use Case Description</label>
                <textarea value={form.useCase} onChange={e => set('useCase', e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Describe how this AI tool will be used and by whom…" />
              </div>
              <div>
                <label style={labelStyle}>Data Classification</label>
                <select value={form.dataClass} onChange={e => set('dataClass', e.target.value)} style={inputStyle}>
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="confidential">Confidential</option>
                  <option value="restricted">Restricted / PII</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={labelStyle}>Control Reference</label>
                <input value={form.controlId} onChange={e => set('controlId', e.target.value)} style={inputStyle} placeholder="e.g. AC-2.4 — Account Review Frequency" />
              </div>
              <div>
                <label style={labelStyle}>Business Justification</label>
                <textarea value={form.justification} onChange={e => set('justification', e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Why is this exception necessary? What is the business constraint?" />
              </div>
              <div>
                <label style={labelStyle}>Compensating Controls</label>
                <input value={form.compensating} onChange={e => set('compensating', e.target.value)} style={inputStyle}
                  placeholder="e.g. Enhanced logging, monthly manual sample review" />
              </div>
              <div>
                <label style={labelStyle}>Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} style={inputStyle} />
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 7, padding: '8px 18px',
            cursor: 'pointer', fontSize: 13,
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!form.name.trim() || submitting} style={{
            background: !form.name.trim() || submitting ? 'var(--surface)' : 'var(--cyan)',
            border: 'none', color: !form.name.trim() || submitting ? 'var(--text-muted)' : '#000',
            borderRadius: 7, padding: '8px 20px', cursor: form.name.trim() && !submitting ? 'pointer' : 'default',
            fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {submitting ? <RefreshCw size={13} className="spin" /> : null}
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Instance Detail Panel ─────────────────────────────────────────────────────
function InstanceDetail({ instance, definition, transitions, transitioning, onTransition, onClose }: {
  instance: WorkflowInstance;
  definition?: WorkflowDefinition;
  transitions: string[];
  transitioning: boolean;
  onTransition: (event: string, note?: string) => void;
  onClose: () => void;
}) {
  const [actor, setActor] = useState('reviewer@org.internal');
  const [note,  setNote]  = useState('');
  const { color: statusColor, label: statusLabel } = STATUS_CONFIG[instance.status] ?? { color: 'var(--text-muted)', label: instance.status };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
      background: 'var(--bg)', borderLeft: '1px solid var(--border)',
      overflowY: 'auto', zIndex: 100, display: 'flex', flexDirection: 'column',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
    }}>
      {/* Header */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{instance.name}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4,
                background: `${statusColor}22`, color: statusColor,
                fontSize: 11, fontWeight: 700,
              }}>{statusLabel}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {stateLabel(definition, instance.currentState)}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 6, padding: '4px 10px',
            cursor: 'pointer', fontSize: 12,
          }}>Close</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Stage tracker */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '16px 14px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            Stage Progress
          </div>
          <StageTracker instance={instance} definition={definition} />
          {!TERMINAL_STATES.includes(instance.currentState) && (
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} /> Current: <strong>{stateLabel(definition, instance.currentState)}</strong>
            </div>
          )}
        </div>

        {/* Context */}
        {Object.keys(instance.context).length > 0 && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Request Details
            </div>
            {Object.entries(instance.context).map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', gap: 12,
                padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12,
              }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize', flexShrink: 0 }}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span style={{ color: 'var(--text)', textAlign: 'right' }}>{String(v)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>Submitted by</span>
              <span style={{ color: 'var(--text)' }}>{instance.createdBy}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>Created</span>
              <span style={{ color: 'var(--text)' }}>{formatDate(instance.createdAt)}</span>
            </div>
          </div>
        )}

        {/* Transition actions */}
        {transitions.length > 0 && instance.status === 'active' && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Actions Available
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Reviewer</label>
              <input value={actor} onChange={e => setActor(e.target.value)} style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 5, padding: '6px 10px', color: 'var(--text)', fontSize: 12,
              }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Note (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 5, padding: '6px 10px', color: 'var(--text)', fontSize: 12,
                resize: 'none', fontFamily: 'inherit',
              }} placeholder="Add a review note…" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {transitions.map(event => {
                const cfg = EVENT_CONFIG[event] ?? { color: 'var(--text-muted)', label: event };
                return (
                  <button key={event} disabled={transitioning} onClick={() => onTransition(event, note || undefined)} style={{
                    background: `${cfg.color}18`, border: `1px solid ${cfg.color}66`,
                    color: cfg.color, borderRadius: 6, padding: '6px 14px',
                    cursor: transitioning ? 'default' : 'pointer',
                    fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 5,
                    opacity: transitioning ? 0.6 : 1,
                  }}>
                    {transitioning ? <RefreshCw size={11} className="spin" /> : <ArrowRight size={11} />}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Audit history */}
        {instance.history.length > 0 && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Audit Trail
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[...instance.history].reverse().map((h, i) => {
                const cfg = EVENT_CONFIG[h.event] ?? { color: 'var(--text-muted)', label: h.event };
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 12, paddingBottom: 12,
                    borderLeft: i < instance.history.length - 1 ? '2px solid var(--border)' : 'none',
                    marginLeft: 7, paddingLeft: 14, position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', left: -7, top: 0,
                      width: 14, height: 14, borderRadius: '50%',
                      background: cfg.color, border: '2px solid var(--bg)',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {stateLabel(undefined, h.fromState)} → {stateLabel(undefined, h.toState)}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                        <User size={9} color="var(--text-muted)" />
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.actor}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatDateTime(h.timestamp)}</span>
                      </div>
                      {h.note && <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 4, fontStyle: 'italic' }}>"{h.note}"</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Instance Row ──────────────────────────────────────────────────────────────
function InstanceRow({ instance, definition, isSelected, onClick }: {
  instance: WorkflowInstance;
  definition?: WorkflowDefinition;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { color, label } = STATUS_CONFIG[instance.status] ?? { color: 'var(--text-muted)', label: instance.status };

  return (
    <div onClick={onClick} style={{
      padding: '14px 18px', borderBottom: '1px solid var(--border)',
      cursor: 'pointer', transition: 'background 0.12s',
      background: isSelected ? 'var(--surface)' : 'transparent',
    }}
    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)44'; }}
    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{instance.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={9} /> {instance.createdBy}
            </span>
            <span>{formatDate(instance.createdAt)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4,
            background: `${color}18`, color, fontSize: 10, fontWeight: 700,
          }}>{label}</span>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
      </div>
      <StageTracker instance={instance} definition={definition} compact />
      {instance.status === 'active' && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--cyan)' }}>
          ▶ {stateLabel(definition, instance.currentState)}
        </div>
      )}
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function WorkflowView() {
  const {
    instances, definitions, selected, transitions,
    loading, transitioning, error,
    activeDefId, setActiveDefId,
    selectInstance, startWorkflow, doTransition, refresh,
  } = useWorkflow();

  const [showModal, setShowModal] = useState(false);

  const activeDef    = definitions.find(d => d.id === activeDefId);
  const visibleItems = instances.filter(i => i.definitionId === activeDefId);
  const counts       = Object.fromEntries(
    definitions.map(d => [d.id, instances.filter(i => i.definitionId === d.id).length])
  );

  const DEF_ICONS: Record<string, typeof Brain> = { 'ai-intake': Brain, 'risk-exception': Shield };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10, color: 'var(--text-muted)' }}>
      <RefreshCw size={16} className="spin" /> Loading workflows…
    </div>
  );

  if (error) return (
    <div style={{ padding: 32, color: 'var(--high)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <AlertTriangle size={16} /> {error}
    </div>
  );

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1200, position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <GitBranch size={20} color="var(--purple)" />
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Governance Workflows</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={refresh} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 6, padding: '5px 12px',
            cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={() => setShowModal(true)} style={{
            background: 'var(--purple)', border: 'none',
            color: '#fff', borderRadius: 6, padding: '5px 14px',
            cursor: 'pointer', fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Plus size={13} /> New Request
          </button>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 24px' }}>
        Track AI use-case intake and risk exception approvals through multi-stage governance gates.
      </p>

      {/* Definition tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {definitions.map(def => {
          const Icon = DEF_ICONS[def.id] ?? GitBranch;
          const isActive = def.id === activeDefId;
          return (
            <button key={def.id} onClick={() => setActiveDefId(def.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 8,
              background: isActive ? 'var(--purple)18' : 'var(--surface)',
              border: `1px solid ${isActive ? 'var(--purple)' : 'var(--border)'}`,
              color: isActive ? 'var(--purple)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 700 : 400,
              transition: 'all 0.15s',
            }}>
              <Icon size={14} />
              <span>{def.name}</span>
              <span style={{
                padding: '1px 7px', borderRadius: 10,
                background: isActive ? 'var(--purple)33' : 'var(--border)',
                color: isActive ? 'var(--purple)' : 'var(--text-muted)',
                fontSize: 11, fontWeight: 700,
              }}>{counts[def.id] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* Description */}
      {activeDef && (
        <div style={{
          padding: '10px 14px', borderRadius: 7,
          background: 'var(--surface)', border: '1px solid var(--border)',
          fontSize: 12, color: 'var(--text-muted)', marginBottom: 18,
        }}>{activeDef.description}</div>
      )}

      {/* Instances list */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {visibleItems.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <GitBranch size={28} style={{ marginBottom: 10, opacity: 0.4 }} />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No workflows yet</div>
            <div style={{ fontSize: 12, marginBottom: 18 }}>Start a new request using the button above.</div>
            <button onClick={() => setShowModal(true)} style={{
              background: 'var(--purple)', border: 'none', color: '#fff',
              borderRadius: 7, padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Plus size={13} /> New Request
            </button>
          </div>
        ) : (
          visibleItems.map(inst => (
            <InstanceRow
              key={inst.id}
              instance={inst}
              definition={activeDef}
              isSelected={selected?.id === inst.id}
              onClick={() => selectInstance(selected?.id === inst.id ? null : inst)}
            />
          ))
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <InstanceDetail
          instance={selected}
          definition={definitions.find(d => d.id === selected.definitionId)}
          transitions={transitions}
          transitioning={transitioning}
          onTransition={(event, note) => doTransition(event, 'reviewer@org.internal', note)}
          onClose={() => selectInstance(null)}
        />
      )}

      {/* New workflow modal */}
      {showModal && (
        <NewWorkflowModal
          definitionId={activeDefId}
          onSubmit={startWorkflow}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
