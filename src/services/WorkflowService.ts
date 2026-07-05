import type {
  WorkflowInstance, WorkflowDefinition,
  WorkflowTransitionRequest, StartWorkflowRequest,
} from '../models';
import type { IWorkflowRepository } from '../repositories/WorkflowRepository';
import { workflowRepository } from '../repositories/WorkflowRepository';
import type { IWorkflowService } from './interfaces/IWorkflowService';

class WorkflowServiceImpl implements IWorkflowService {
  constructor(private readonly repo: IWorkflowRepository) {}

  getAll()                                  { return this.repo.listInstances(); }
  getById(id: string)                       { return this.repo.getInstance(id); }
  getDefinitions()                          { return this.repo.listDefinitions(); }
  getAvailableTransitions(id: string)       { return this.repo.getAvailableTransitions(id); }
  start(req: StartWorkflowRequest)          { return this.repo.start(req); }
  transition(id: string, req: WorkflowTransitionRequest) { return this.repo.transition(id, req); }

  getByDefinition(definitionId: string, instances: WorkflowInstance[]): WorkflowInstance[] {
    return instances.filter(i => i.definitionId === definitionId);
  }
}

export const WorkflowService: IWorkflowService = new WorkflowServiceImpl(workflowRepository);
