import { Router, Request, Response, NextFunction } from 'express';
import { DomainService } from '../services/DomainService';
import { createError }   from '../middleware/errorHandler';

export const domainsRouter = Router();

domainsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: DomainService.getAll() });
});

domainsRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const domain = DomainService.getById(req.params.id);
  if (!domain) return next(createError(`Domain '${req.params.id}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: domain });
});

domainsRouter.get('/:id/kris', (req: Request, res: Response, next: NextFunction) => {
  const domain = DomainService.getById(req.params.id);
  if (!domain) return next(createError(`Domain '${req.params.id}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: domain.kris });
});
