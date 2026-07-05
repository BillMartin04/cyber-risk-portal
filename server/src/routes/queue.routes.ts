import { Router, Request, Response, NextFunction } from 'express';
import { QueueEngine } from '../queue/QueueEngine';
import { createError } from '../middleware/errorHandler';
import type { JobStatus } from '../queue/types';

const VALID_STATUSES: JobStatus[] = ['pending', 'processing', 'completed', 'failed', 'scheduled'];

export const queueRouter = Router();

queueRouter.get('/jobs', (req: Request, res: Response) => {
  const s = req.query.status as string | undefined;
  const status = VALID_STATUSES.includes(s as JobStatus) ? (s as JobStatus) : undefined;
  res.json({ success: true, data: QueueEngine.listJobs(status) });
});

queueRouter.post('/enqueue', (req: Request, res: Response, next: NextFunction) => {
  const { type, payload, priority, scheduledAt, maxRetries } = req.body;
  if (!type) return next(createError('type is required', 400));
  const job = QueueEngine.enqueue(type, payload, { priority, scheduledAt, maxRetries });
  res.status(201).json({ success: true, data: job });
});

queueRouter.get('/jobs/:id', (req: Request, res: Response, next: NextFunction) => {
  const job = QueueEngine.getJob(req.params.id);
  if (!job) return next(createError(`Job '${req.params.id}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: job });
});
