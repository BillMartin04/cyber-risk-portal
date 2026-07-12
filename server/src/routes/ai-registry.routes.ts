import { Router } from 'express';
import { AIRegistryService } from '../services/AIRegistryService';

export const aiRegistryRouter = Router();

aiRegistryRouter.get('/', (_req, res) => {
  res.json({ success: true, data: AIRegistryService.getAllTools() });
});

aiRegistryRouter.get('/stats', (_req, res) => {
  res.json({ success: true, data: AIRegistryService.getStats() });
});

aiRegistryRouter.get('/:id', (req, res) => {
  const tool = AIRegistryService.getToolById(req.params.id);
  if (!tool) return res.status(404).json({ success: false, error: 'Tool not found' });
  res.json({ success: true, data: tool });
});

aiRegistryRouter.patch('/:id/status', (req, res) => {
  const { status, actor, note } = req.body as { status: string; actor: string; note: string };
  if (!status || !actor) return res.status(400).json({ success: false, error: 'status and actor are required' });
  const tool = AIRegistryService.updateToolStatus(req.params.id, status, actor, note ?? '');
  if (!tool) return res.status(404).json({ success: false, error: 'Tool not found' });
  res.json({ success: true, data: tool });
});
