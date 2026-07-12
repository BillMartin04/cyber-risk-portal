import {
  createContext, useContext, useState, useCallback, useRef,
  type ReactNode,
} from 'react';
import type {
  AIMode, AIAction, AIMessage, AIApprovalItem, AIStatus,
} from '../models';
import { AIAssistService } from '../services/AIAssistService';

interface PageContext {
  page:     string;
  domainId?: string;
  domainName?: string;
  riskId?:  string;
  riskName?: string;
  score?:   number;
  [key: string]: unknown;
}

interface AIAssistContextValue {
  open:          boolean;
  toggle:        () => void;
  close:         () => void;
  mode:          AIMode;
  setMode:       (m: AIMode) => void;
  messages:      AIMessage[];
  sending:       boolean;
  approvalQueue: AIApprovalItem[];
  status:        AIStatus | null;
  pageContext:   PageContext;
  setPageContext:(ctx: PageContext) => void;
  send:          (prompt: string, action: AIAction) => Promise<void>;
  approve:       (id: string) => Promise<void>;
  reject:        (id: string, reason: string) => Promise<void>;
  execute:          (id: string) => Promise<void>;
  resetToPending:   (id: string) => Promise<void>;
  clearChat:        () => void;
  refreshQueue:     () => Promise<void>;
}

const AIAssistContext = createContext<AIAssistContextValue | null>(null);

export function AIAssistProvider({ children }: { children: ReactNode }) {
  const [open,          setOpen]          = useState(false);
  const [mode,          setMode]          = useState<AIMode>('genai');
  const [messages,      setMessages]      = useState<AIMessage[]>([]);
  const [sending,       setSending]       = useState(false);
  const [approvalQueue, setApprovalQueue] = useState<AIApprovalItem[]>([]);
  const [status,        setStatus]        = useState<AIStatus | null>(null);
  const [pageContext,   setPageContext]   = useState<PageContext>({ page: 'dashboard' });
  const idSeq = useRef(0);

  const nextId = () => `msg-${Date.now()}-${idSeq.current++}`;

  const toggle = useCallback(() => {
    setOpen(v => {
      if (!v) {
        AIAssistService.getStatus().then(setStatus).catch(() => null);
        AIAssistService.getApprovalQueue().then(setApprovalQueue).catch(() => null);
      }
      return !v;
    });
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const send = useCallback(async (prompt: string, action: AIAction) => {
    const userMsg: AIMessage = {
      id: nextId(), role: 'user', content: prompt, action,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const resp = await AIAssistService.ask({
        action, mode,
        context: pageContext as Record<string, unknown>,
        prompt,
        conversation_history: history,
      });

      const aiMsg: AIMessage = {
        id: nextId(), role: 'assistant',
        content: resp.response,
        action,
        timestamp: resp.timestamp,
        tokensUsed: resp.tokens_used,
        suggestedActions: resp.suggested_agent_actions,
      };
      setMessages(prev => [...prev, aiMsg]);

      if (resp.suggested_agent_actions.length > 0) {
        setApprovalQueue(prev => [
          ...prev,
          ...resp.suggested_agent_actions.map(s => ({
            id:              s.id,
            proposed_action: s.action,
            description:     s.description,
            impact:          s.impact,
            risk_level:      s.risk_level,
            status:          'pending' as const,
            tier:            s.tier,
            context:         pageContext as Record<string, unknown>,
            created_at:      new Date().toISOString(),
          })),
        ]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: nextId(), role: 'assistant',
        content: 'Unable to reach the AI service. Please check that the Python AI service is running on port 8000.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
    }
  }, [messages, mode, pageContext]);

  const refreshQueue = useCallback(async () => {
    try {
      const q = await AIAssistService.getApprovalQueue();
      setApprovalQueue(q);
    } catch { /* ignore */ }
  }, []);

  const approve = useCallback(async (id: string) => {
    const updated = await AIAssistService.approveAction(id);
    setApprovalQueue(prev => prev.map(i => i.id === id ? updated : i));
  }, []);

  const reject = useCallback(async (id: string, reason: string) => {
    const updated = await AIAssistService.rejectAction(id, reason);
    setApprovalQueue(prev => prev.map(i => i.id === id ? updated : i));
  }, []);

  const execute = useCallback(async (id: string) => {
    const updated = await AIAssistService.executeAction(id);
    setApprovalQueue(prev => prev.map(i => i.id === id ? updated : i));
  }, []);

  const resetToPending = useCallback(async (id: string) => {
    const updated = await AIAssistService.resetAction(id);
    setApprovalQueue(prev => prev.map(i => i.id === id ? updated : i));
  }, []);

  const clearChat = useCallback(() => setMessages([]), []);

  return (
    <AIAssistContext.Provider value={{
      open, toggle, close, mode, setMode,
      messages, sending, approvalQueue, status, pageContext, setPageContext,
      send, approve, reject, execute, resetToPending, clearChat, refreshQueue,
    }}>
      {children}
    </AIAssistContext.Provider>
  );
}

export function useAIAssist() {
  const ctx = useContext(AIAssistContext);
  if (!ctx) throw new Error('useAIAssist must be used inside AIAssistProvider');
  return ctx;
}
