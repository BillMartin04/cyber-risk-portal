import { v4 as uuidv4 } from 'uuid';
import type {
  WorkflowDefinition, WorkflowInstance, WorkflowStatus,
  WorkflowContext, TransitionRequest, WorkflowHistoryEntry,
} from './types';
import { aiIntakeWorkflow, riskExceptionWorkflow } from './definitions/aiIntakeWorkflow';

export interface IWorkflowEngine {
  start(definitionId: string, name: string, createdBy: string, context?: WorkflowContext): WorkflowInstance;
  getInstance(id: string): WorkflowInstance | undefined;
  listInstances(status?: WorkflowStatus): WorkflowInstance[];
  transition(id: string, req: TransitionRequest): WorkflowInstance;
  getDefinition(id: string): WorkflowDefinition | undefined;
  listDefinitions(): WorkflowDefinition[];
  getAvailableTransitions(instanceId: string): string[];
}

class WorkflowEngineImpl implements IWorkflowEngine {
  private readonly definitions = new Map<string, WorkflowDefinition>();
  private readonly instances   = new Map<string, WorkflowInstance>();

  constructor(definitions: WorkflowDefinition[]) {
    definitions.forEach(d => this.definitions.set(d.id, d));
  }

  getDefinition(id: string): WorkflowDefinition | undefined {
    return this.definitions.get(id);
  }

  listDefinitions(): WorkflowDefinition[] {
    return Array.from(this.definitions.values());
  }

  start(definitionId: string, name: string, createdBy: string, context: WorkflowContext = {}): WorkflowInstance {
    const definition = this.definitions.get(definitionId);
    if (!definition) throw new Error(`Workflow definition '${definitionId}' not found`);

    const instance: WorkflowInstance = {
      id:           uuidv4(),
      definitionId,
      name,
      currentState: definition.initialState,
      status:       'active',
      context,
      history:      [],
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
      createdBy,
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  getInstance(id: string): WorkflowInstance | undefined {
    return this.instances.get(id);
  }

  listInstances(status?: WorkflowStatus): WorkflowInstance[] {
    const all = Array.from(this.instances.values());
    return status ? all.filter(i => i.status === status) : all;
  }

  transition(id: string, req: TransitionRequest): WorkflowInstance {
    const instance = this.instances.get(id);
    if (!instance)              throw new Error(`Workflow instance '${id}' not found`);
    if (instance.status !== 'active') throw new Error(`Workflow instance '${id}' is not active`);

    const definition = this.definitions.get(instance.definitionId)!;
    const stateDef   = definition.states[instance.currentState];
    if (!stateDef)              throw new Error(`Unknown state '${instance.currentState}'`);

    const transitionDef = stateDef.transitions[req.event];
    if (!transitionDef)         throw new Error(`Event '${req.event}' not valid in state '${instance.currentState}'`);

    if (transitionDef.guard && !transitionDef.guard(instance.context)) {
      throw new Error(`Transition guard failed for event '${req.event}'`);
    }

    const newContext = transitionDef.action
      ? transitionDef.action({ ...instance.context, ...(req.data ?? {}) })
      : { ...instance.context, ...(req.data ?? {}) };

    const historyEntry: WorkflowHistoryEntry = {
      fromState: instance.currentState,
      toState:   transitionDef.target,
      event:     req.event,
      actor:     req.actor,
      timestamp: new Date().toISOString(),
      note:      req.note,
    };

    const targetStateDef = definition.states[transitionDef.target];
    const isTerminal     = targetStateDef?.terminal ?? false;

    const updated: WorkflowInstance = {
      ...instance,
      currentState: transitionDef.target,
      status:       isTerminal
        ? (transitionDef.target === 'approved' || transitionDef.target === 'conditional-approval')
          ? 'completed'
          : transitionDef.target === 'cancelled' ? 'cancelled' : 'rejected'
        : 'active',
      context:  newContext,
      history:  [...instance.history, historyEntry],
      updatedAt: new Date().toISOString(),
    };

    this.instances.set(id, updated);
    return updated;
  }

  getAvailableTransitions(instanceId: string): string[] {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.status !== 'active') return [];
    const definition = this.definitions.get(instance.definitionId)!;
    const stateDef   = definition.states[instance.currentState];
    return Object.keys(stateDef?.transitions ?? {});
  }
}

export const WorkflowEngine: IWorkflowEngine = new WorkflowEngineImpl([
  aiIntakeWorkflow,
  riskExceptionWorkflow,
]);
