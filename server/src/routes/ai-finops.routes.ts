import { Router } from 'express';
import { AIFinOpsService } from '../services/AIFinOpsService';

export const aiFinOpsRouter = Router();

aiFinOpsRouter.get('/', (_req, res) => {
  res.json({ success: true, data: AIFinOpsService.getData() });
});

aiFinOpsRouter.get('/shadow', (_req, res) => {
  res.json({ success: true, data: AIFinOpsService.getShadowTools() });
});

aiFinOpsRouter.get('/departments', (_req, res) => {
  res.json({ success: true, data: AIFinOpsService.getDepartmentBreakdown() });
});
