import { Router, Request, Response, NextFunction } from 'express';
import { WorkflowEngine } from '../workflow/WorkflowEngine';
import { createError }    from '../middleware/errorHandler';

export const workflowRouter = Router();

workflowRouter.get('/definitions', (_req: Request, res: Response) =>
  res.json({ success: true, data: WorkflowEngine.listDefinitions() }));

workflowRouter.post('/start', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { definitionId, name, createdBy, context } = req.body;
    if (!definitionId || !name || !createdBy)
      return next(createError('definitionId, name, and createdBy are required', 400));
    const instance = WorkflowEngine.start(definitionId, name, createdBy, context);
    res.status(201).json({ success: true, data: instance });
  } catch (err) {
    next(createError((err as Error).message, 400));
  }
});

workflowRouter.get('/', (_req: Request, res: Response) =>
  res.json({ success: true, data: WorkflowEngine.listInstances() }));

workflowRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const instance = WorkflowEngine.getInstance(req.params.id);
  if (!instance) return next(createError(`Workflow '${req.params.id}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: instance });
});

workflowRouter.get('/:id/transitions', (req: Request, res: Response, next: NextFunction) => {
  const instance = WorkflowEngine.getInstance(req.params.id);
  if (!instance) return next(createError(`Workflow '${req.params.id}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: WorkflowEngine.getAvailableTransitions(req.params.id) });
});

workflowRouter.post('/:id/transition', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { event, actor, note, data } = req.body;
    if (!event || !actor) return next(createError('event and actor are required', 400));
    const updated = WorkflowEngine.transition(req.params.id, { event, actor, note, data });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(createError((err as Error).message, 400));
  }
});
