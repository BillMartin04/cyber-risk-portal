import { Router, Request, Response, NextFunction } from 'express';
import { AIAssistService } from '../ai/AIAssistService';
import { AgenticService }  from '../ai/AgenticService';
import { createError }     from '../middleware/errorHandler';
import type { AIAssistRequest } from '../ai/types';

export const aiRouter = Router();

aiRouter.get('/status', (_req: Request, res: Response) =>
  res.json({ success: true, data: { live: AIAssistService.isLive(), model: 'claude-sonnet-4-6' } }));

aiRouter.post('/assist', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assistReq = req.body as AIAssistRequest;
    if (!assistReq.mode || !assistReq.action || !assistReq.context)
      return next(createError('mode, action, and context are required', 400));
    const response = await AIAssistService.process(assistReq);
    res.json({ success: true, data: response });
  } catch (err) {
    next(createError((err as Error).message, 500, 'AI_ERROR'));
  }
});

aiRouter.get('/approval-queue', (_req: Request, res: Response) =>
  res.json({ success: true, data: AgenticService.getApprovalQueue() }));

aiRouter.post('/approval-queue/:id/approve', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decidedBy, note } = req.body;
    if (!decidedBy) return next(createError('decidedBy is required', 400));
    res.json({ success: true, data: AgenticService.approve(req.params.id, decidedBy, note) });
  } catch (err) {
    next(createError((err as Error).message, 400));
  }
});

aiRouter.post('/approval-queue/:id/reject', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decidedBy, note } = req.body;
    if (!decidedBy) return next(createError('decidedBy is required', 400));
    res.json({ success: true, data: AgenticService.reject(req.params.id, decidedBy, note) });
  } catch (err) {
    next(createError((err as Error).message, 400));
  }
});

aiRouter.post('/approval-queue/:id/execute', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await AgenticService.executeApproved(req.params.id) });
  } catch (err) {
    next(createError((err as Error).message, 400));
  }
});
