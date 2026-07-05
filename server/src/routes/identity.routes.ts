import { Router, Request, Response, NextFunction } from 'express';
import { IdentityService } from '../services/IdentityService';
import { createError } from '../middleware/errorHandler';
import type { IdentityType, IdentityRole, IdentityStatus } from '../models';

export const identityRouter = Router();

identityRouter.get('/',           (_req, res: Response) => res.json({ success: true, data: IdentityService.getAllIdentities() }));
identityRouter.get('/stats',      (_req, res: Response) => res.json({ success: true, data: IdentityService.getStats() }));
identityRouter.get('/privileged', (_req, res: Response) => res.json({ success: true, data: IdentityService.getPrivileged() }));
identityRouter.get('/overdue',    (_req, res: Response) => res.json({ success: true, data: IdentityService.getReviewOverdue() }));
identityRouter.get('/access-review', (_req, res: Response) => res.json({ success: true, data: IdentityService.getAccessReviewQueue() }));

identityRouter.get('/search', (req: Request, res: Response) => {
  const q = req.query.q as string ?? '';
  res.json({ success: true, data: IdentityService.searchIdentities(q) });
});

identityRouter.get('/by-type/:type', (req: Request, res: Response) =>
  res.json({ success: true, data: IdentityService.getByType(req.params.type as IdentityType) }));

identityRouter.get('/by-role/:role', (req: Request, res: Response) =>
  res.json({ success: true, data: IdentityService.getByRole(req.params.role as IdentityRole) }));

identityRouter.get('/by-status/:status', (req: Request, res: Response) =>
  res.json({ success: true, data: IdentityService.getByStatus(req.params.status as IdentityStatus) }));

identityRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const identity = IdentityService.getIdentityById(req.params.id);
  if (!identity) return next(createError(`Identity '${req.params.id}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: identity });
});
