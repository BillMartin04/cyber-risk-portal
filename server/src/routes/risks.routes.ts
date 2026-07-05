import { Router, Request, Response, NextFunction } from 'express';
import { RiskService }  from '../services/RiskService';
import { createError }  from '../middleware/errorHandler';

export const risksRouter = Router();

risksRouter.get('/:domainId/:riskId', (req: Request, res: Response, next: NextFunction) => {
  const risk = RiskService.getById(req.params.domainId, req.params.riskId);
  if (!risk) return next(createError(`Risk '${req.params.riskId}' not found`, 404, 'NOT_FOUND'));
  res.json({ success: true, data: risk });
});
