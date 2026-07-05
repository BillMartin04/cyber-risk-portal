import type {
  WorkflowInstance, WorkflowDefinition,
  WorkflowTransitionRequest, StartWorkflowRequest,
} from '../../models';

export interface IWorkflowService {
  getAll(): Promise<WorkflowInstance[]>;
  getById(id: string): Promise<WorkflowInstance>;
  getDefinitions(): Promise<WorkflowDefinition[]>;
  getAvailableTransitions(id: string): Promise<string[]>;
  start(req: StartWorkflowRequest): Promise<WorkflowInstance>;
  transition(id: string, req: WorkflowTransitionRequest): Promise<WorkflowInstance>;
  getByDefinition(definitionId: string, instances: WorkflowInstance[]): WorkflowInstance[];
}
