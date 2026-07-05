export type WorkflowStatus = 'active' | 'completed' | 'rejected' | 'cancelled';

export interface WorkflowContext {
  [key: string]: unknown;
}

export interface WorkflowTransitionDef {
  target:  string;
  label:   string;
  guard?:  (ctx: WorkflowContext) => boolean;
  action?: (ctx: WorkflowContext) => WorkflowContext;
}

export interface WorkflowStateDef {
  label:       string;
  terminal?:   boolean;
  transitions: Record<string, WorkflowTransitionDef>;
}

export interface WorkflowDefinition {
  id:           string;
  name:         string;
  description:  string;
  initialState: string;
  states:       Record<string, WorkflowStateDef>;
}

export interface WorkflowHistoryEntry {
  fromState:  string;
  toState:    string;
  event:      string;
  actor:      string;
  timestamp:  string;
  note?:      string;
}

export interface WorkflowInstance {
  id:           string;
  definitionId: string;
  name:         string;
  currentState: string;
  status:       WorkflowStatus;
  context:      WorkflowContext;
  history:      WorkflowHistoryEntry[];
  createdAt:    string;
  updatedAt:    string;
  createdBy:    string;
}

export interface TransitionRequest {
  event:  string;
  actor:  string;
  note?:  string;
  data?:  WorkflowContext;
}
