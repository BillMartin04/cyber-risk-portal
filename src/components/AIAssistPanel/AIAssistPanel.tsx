import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Send, Bot, User, RefreshCw, ChevronDown,
  CheckCircle2, XCircle, Play, Clock, AlertTriangle, Zap, MessageSquare,
  ListChecks, Cpu,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAIAssist } from '../../context/AIAssistContext';
import { getSuggestedPrompts } from './prompts';
import type { AIAction, AIApprovalItem } from '../../models';

// ── Action options ─────────────────────────────────────────────────────────────

const ACTIONS: { value: AIAction; label: string }[] = [
  { value: 'summarize',          label: 'Summarize' },
  { value: 'analyze-controls',   label: 'Analyze Controls' },
  { value: 'draft-issue',        label: 'Draft Issue' },
  { value: 'policy-guidance',    label: 'Policy Guidance' },
  { value: 'impact-translation', label: 'Impact Translation' },
  { value: 'report-draft',       label: 'Report Draft' },
  { value: 'recommend-controls', label: 'Recommend Controls' },
  { value: 'risk-deep-dive',     label: 'Risk Deep Dive' },
  { value: 'compliance-check',   label: 'Compliance Check' },
];

const RISK_COLOR: Record<string, string> = {
  low: 'var(--low)', medium: 'var(--medium)',
  high: 'var(--high)', critical: 'var(--critical)',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:  { label: 'Pending',  color: 'var(--medium)' },
  approved: { label: 'Approved', color: 'var(--low)' },
  rejected: { label: 'Rejected', color: 'var(--critical)' },
  executed: { label: 'Executed', color: 'var(--cyan)' },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ── Approval queue item card ───────────────────────────────────────────────────

function ApprovalCard({ item, onApprove, onReject, onExecute }: {
  item: AIApprovalItem;
  onApprove: () => void;
  onReject:  () => void;
  onExecute: () => void;
}) {
  const [rejReason, setRejReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const { label, color } = STATUS_CONFIG[item.status];
  const riskColor = RISK_COLOR[item.risk_level] ?? 'var(--text-muted)';

  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 8, padding: 12, marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', flex: 1, marginRight: 8 }}>
          {item.proposed_action.replace(/-/g, ' ').toUpperCase()}
        </div>
        <span style={{
          padding: '2px 7px', borderRadius: 4,
          background: `${color}18`, color, fontSize: 10, fontWeight: 600, flexShrink: 0,
        }}>{label}</span>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{item.description}</div>
      <div style={{ fontSize: 11, color: riskColor, marginBottom: 8 }}>
        Impact: {item.impact}
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginRight: 'auto' }}>
          {item.tier} · {formatTime(item.created_at)}
        </span>
        {item.status === 'pending' && (
          <>
            <button onClick={onApprove} style={{
              background: 'var(--low)18', border: '1px solid var(--low)',
              color: 'var(--low)', borderRadius: 5, padding: '3px 10px',
              fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <CheckCircle2 size={10} /> Approve
            </button>
            <button onClick={() => setShowReject(v => !v)} style={{
              background: 'var(--critical)18', border: '1px solid var(--critical)',
              color: 'var(--critical)', borderRadius: 5, padding: '3px 10px',
              fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <XCircle size={10} /> Reject
            </button>
          </>
        )}
        {item.status === 'approved' && (
          <button onClick={onExecute} style={{
            background: 'var(--cyan)18', border: '1px solid var(--cyan)',
            color: 'var(--cyan)', borderRadius: 5, padding: '3px 10px',
            fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Play size={10} /> Execute
          </button>
        )}
      </div>

      {showReject && item.status === 'pending' && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
          <input
            value={rejReason}
            onChange={e => setRejReason(e.target.value)}
            placeholder="Reason for rejection…"
            style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 5, padding: '4px 8px', color: 'var(--text)', fontSize: 11,
            }}
          />
          <button onClick={() => { onReject(); setShowReject(false); }} style={{
            background: 'var(--critical)18', border: '1px solid var(--critical)',
            color: 'var(--critical)', borderRadius: 5, padding: '4px 10px',
            fontSize: 11, cursor: 'pointer',
          }}>Send</button>
        </div>
      )}

      {item.result && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--cyan)', borderTop: '1px solid var(--border)', paddingTop: 6 }}>
          {item.result}
        </div>
      )}
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────────

export default function AIAssistPanel() {
  const {
    open, close, mode, setMode,
    messages, sending, approvalQueue, status, pageContext,
    send, approve, reject, execute, clearChat, refreshQueue,
  } = useAIAssist();

  const [tab,    setTab]    = useState<'chat' | 'queue' | 'about'>('chat');
  const [input,  setInput]  = useState('');
  const [action, setAction] = useState<AIAction>('summarize');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const suggestedPrompts = getSuggestedPrompts(pageContext.page);
  const pendingCount = approvalQueue.filter(i => i.status === 'pending').length;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    await send(text, action);
  };

  const handlePrompt = (p: { prompt: string; action: AIAction }) => {
    setAction(p.action);
    send(p.prompt, p.action);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
      background: 'var(--bg)', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 200,
      boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--cyan)33, var(--purple)33)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={15} color="var(--cyan)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>AI Assist</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {status?.ai_enabled ? `● LIVE · ${status.model}` : '○ Fallback mode'}
            {pageContext.domainName && ` · ${pageContext.domainName}`}
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden',
        }}>
          {(['genai', 'agentic'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: '4px 10px', fontSize: 10, fontWeight: 600,
              background: mode === m ? 'var(--cyan)' : 'transparent',
              color: mode === m ? '#000' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', textTransform: 'capitalize',
            }}>{m === 'genai' ? 'GenAI' : 'Agentic'}</button>
          ))}
        </div>

        <button onClick={close} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
        }}>
          <X size={16} />
        </button>
      </div>

      {/* Context strip */}
      {(pageContext.domainName || pageContext.riskName) && (
        <div style={{
          padding: '6px 16px', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Context:</span>
          {pageContext.domainName && (
            <span style={{
              padding: '1px 7px', borderRadius: 4,
              background: 'var(--cyan)18', color: 'var(--cyan)', fontSize: 10,
            }}>{pageContext.domainName}</span>
          )}
          {pageContext.riskName && (
            <span style={{
              padding: '1px 7px', borderRadius: 4,
              background: 'var(--purple)18', color: 'var(--purple)', fontSize: 10,
            }}>{pageContext.riskName}</span>
          )}
          {pageContext.score !== undefined && (
            <span style={{
              padding: '1px 7px', borderRadius: 4,
              background: 'var(--high)18', color: 'var(--high)', fontSize: 10,
            }}>Score: {pageContext.score}</span>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        {([
          { id: 'chat',  label: 'Chat',      icon: MessageSquare },
          { id: 'queue', label: `Queue${pendingCount > 0 ? ` (${pendingCount})` : ''}`, icon: ListChecks },
          { id: 'about', label: 'About',     icon: Cpu },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '8px 0', background: 'none', border: 'none',
            fontSize: 11, fontWeight: tab === id ? 600 : 400, cursor: 'pointer',
            color: tab === id ? 'var(--cyan)' : 'var(--text-muted)',
            borderBottom: tab === id ? '2px solid var(--cyan)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <Icon size={11} />{label}
          </button>
        ))}
      </div>

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {messages.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 20 }}>
                  <Sparkles size={28} color="var(--cyan)" style={{ marginBottom: 8, opacity: 0.6 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                    AI Assist — {pageContext.page.charAt(0).toUpperCase() + pageContext.page.slice(1)}
                  </div>
                  <div style={{ fontSize: 11 }}>Ask anything about your current risk context.</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Suggested
                  </div>
                  {suggestedPrompts.map(p => (
                    <button key={p.label} onClick={() => handlePrompt(p)} style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 7, padding: '8px 12px', cursor: 'pointer',
                      textAlign: 'left', color: 'var(--text)', fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cyan)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                      <span>{p.label}</span>
                      <ChevronDown size={11} color="var(--text-muted)" style={{ transform: 'rotate(-90deg)' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: 8, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                  background: msg.role === 'user' ? 'var(--cyan)22' : 'var(--purple)22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'user'
                    ? <User size={13} color="var(--cyan)" />
                    : <Bot size={13} color="var(--purple)" />}
                </div>

                <div style={{ flex: 1, maxWidth: '85%' }}>
                  <div style={{
                    background: msg.role === 'user' ? 'var(--cyan)12' : 'var(--surface)',
                    border: `1px solid ${msg.role === 'user' ? 'var(--cyan)33' : 'var(--border)'}`,
                    borderRadius: 8, padding: '8px 12px',
                    fontSize: 12, color: 'var(--text)', lineHeight: 1.6,
                  }}>
                    {msg.role === 'assistant' ? (
                      <div className="ai-markdown">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatTime(msg.timestamp)}</span>
                    {msg.tokensUsed && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {msg.tokensUsed} tokens</span>
                    )}
                    {msg.action && (
                      <span style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 3,
                        background: 'var(--purple)18', color: 'var(--purple)',
                      }}>{msg.action}</span>
                    )}
                  </div>

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Suggested Agent Actions
                      </div>
                      {msg.suggestedActions.map(a => (
                        <div key={a.id} style={{
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          borderRadius: 6, padding: '6px 10px', fontSize: 11,
                        }}>
                          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                            {a.action.replace(/-/g, ' ')}
                          </div>
                          <div style={{ color: 'var(--text-muted)' }}>{a.description}</div>
                          <div style={{ color: RISK_COLOR[a.risk_level] ?? 'var(--text-muted)', marginTop: 3 }}>
                            Impact: {a.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'var(--purple)22', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={13} color="var(--purple)" />
                </div>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 14px', display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 150, 300].map(d => (
                    <div key={d} style={{
                      width: 5, height: 5, borderRadius: '50%', background: 'var(--purple)',
                      animation: `pulse 1s ${d}ms ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '10px 14px', borderTop: '1px solid var(--border)',
            background: 'var(--bg)', flexShrink: 0,
          }}>
            {messages.length > 0 && (
              <button onClick={clearChat} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10, color: 'var(--text-muted)', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <RefreshCw size={9} /> Clear chat
              </button>
            )}

            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <select value={action} onChange={e => setAction(e.target.value as AIAction)} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 5, padding: '4px 8px', color: 'var(--text)', fontSize: 11, flex: '0 0 auto',
              }}>
                {ACTIONS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 7 }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Ask about ${pageContext.page}… (Enter to send, Shift+Enter for new line)`}
                rows={2}
                style={{
                  flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 7, padding: '8px 10px', color: 'var(--text)', fontSize: 12,
                  resize: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
              <button onClick={handleSend} disabled={!input.trim() || sending} style={{
                background: input.trim() && !sending ? 'var(--cyan)' : 'var(--surface)',
                border: `1px solid ${input.trim() && !sending ? 'var(--cyan)' : 'var(--border)'}`,
                color: input.trim() && !sending ? '#000' : 'var(--text-muted)',
                borderRadius: 7, padding: '0 14px', cursor: input.trim() && !sending ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                transition: 'all 0.15s',
              }}>
                {sending ? <RefreshCw size={13} className="spin" /> : <Send size={13} />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── QUEUE TAB ── */}
      {tab === 'queue' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Approval Queue
            </div>
            <button onClick={refreshQueue} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
            }}>
              <RefreshCw size={11} /> Refresh
            </button>
          </div>

          {approvalQueue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <CheckCircle2 size={24} style={{ marginBottom: 8 }} color="var(--low)" />
              <div style={{ fontSize: 13 }}>No pending actions</div>
            </div>
          ) : (
            approvalQueue.map(item => (
              <ApprovalCard
                key={item.id}
                item={item}
                onApprove={() => approve(item.id)}
                onReject={() => reject(item.id, '')}
                onExecute={() => execute(item.id)}
              />
            ))
          )}
        </div>
      )}

      {/* ── ABOUT TAB ── */}
      {tab === 'about' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            AI Service Status
          </div>
          {status ? (
            <>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 14, marginBottom: 12,
              }}>
                {[
                  ['Status',  status.status],
                  ['AI Live', status.ai_enabled ? 'Yes — Claude API connected' : 'No — Fallback mode'],
                  ['Model',   status.model],
                  ['Engine',  status.service],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12,
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ color: k === 'AI Live' ? (status.ai_enabled ? 'var(--low)' : 'var(--high)') : 'var(--text)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Frameworks
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {status.frameworks.map(f => (
                  <span key={f} style={{
                    padding: '3px 8px', borderRadius: 4,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    fontSize: 11, color: 'var(--cyan)',
                  }}>{f}</span>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Capabilities
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {status.capabilities.map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <Zap size={11} color="var(--cyan)" />
                    <span style={{ color: 'var(--text)' }}>{c}</span>
                  </div>
                ))}
              </div>

              {!status.ai_enabled && (
                <div style={{
                  marginTop: 16, padding: '10px 12px', borderRadius: 8,
                  background: 'var(--high)12', border: '1px solid var(--high)44',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--high)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={11} /> Enable Live AI
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Add your Anthropic API key to <code style={{ color: 'var(--cyan)' }}>ai-service/.env</code>:
                  </div>
                  <code style={{
                    display: 'block', marginTop: 6, padding: '6px 8px',
                    background: 'var(--bg)', borderRadius: 5,
                    fontSize: 10, color: 'var(--low)',
                  }}>ANTHROPIC_API_KEY=sk-ant-…</code>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
              <Clock size={24} style={{ marginBottom: 8 }} />
              <div>Open the panel to load status</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
