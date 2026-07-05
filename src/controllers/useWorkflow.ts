import { useState, useEffect, useCallback } from 'react';
import type {
  WorkflowInstance, WorkflowDefinition,
  WorkflowTransitionRequest, StartWorkflowRequest,
} from '../models';
import { WorkflowService } from '../services/WorkflowService';

export interface WorkflowViewModel {
  instances:    WorkflowInstance[];
  definitions:  WorkflowDefinition[];
  selected:     WorkflowInstance | null;
  transitions:  string[];
  loading:      boolean;
  transitioning: boolean;
  error:        string | null;
  activeDefId:  string;
  setActiveDefId: (id: string) => void;
  selectInstance: (instance: WorkflowInstance | null) => void;
  startWorkflow:  (req: StartWorkflowRequest) => Promise<void>;
  doTransition:   (event: string, actor: string, note?: string) => Promise<void>;
  refresh:        () => void;
}

export function useWorkflow(): WorkflowViewModel {
  const [instances,    setInstances]    = useState<WorkflowInstance[]>([]);
  const [definitions,  setDefinitions]  = useState<WorkflowDefinition[]>([]);
  const [selected,     setSelected]     = useState<WorkflowInstance | null>(null);
  const [transitions,  setTransitions]  = useState<string[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [activeDefId,  setActiveDefId]  = useState('ai-intake');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [inst, defs] = await Promise.all([
        WorkflowService.getAll(),
        WorkflowService.getDefinitions(),
      ]);
      setInstances(inst);
      setDefinitions(defs);
    } catch {
      setError('Could not load workflows. Ensure the Node.js server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selectInstance = useCallback(async (instance: WorkflowInstance | null) => {
    setSelected(instance);
    setTransitions([]);
    if (instance && instance.status === 'active') {
      try {
        const t = await WorkflowService.getAvailableTransitions(instance.id);
        setTransitions(t);
      } catch { /* ignore */ }
    }
  }, []);

  const startWorkflow = useCallback(async (req: StartWorkflowRequest) => {
    const inst = await WorkflowService.start(req);
    setInstances(prev => [inst, ...prev]);
    await selectInstance(inst);
  }, [selectInstance]);

  const doTransition = useCallback(async (event: string, actor: string, note?: string) => {
    if (!selected) return;
    setTransitioning(true);
    try {
      const updated = await WorkflowService.transition(selected.id, { event, actor, note });
      setInstances(prev => prev.map(i => i.id === updated.id ? updated : i));
      setSelected(updated);
      if (updated.status === 'active') {
        const t = await WorkflowService.getAvailableTransitions(updated.id);
        setTransitions(t);
      } else {
        setTransitions([]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTransitioning(false);
    }
  }, [selected]);

  return {
    instances, definitions, selected, transitions,
    loading, transitioning, error, activeDefId, setActiveDefId,
    selectInstance, startWorkflow, doTransition, refresh: load,
  };
}
