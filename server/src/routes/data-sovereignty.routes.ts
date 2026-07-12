import { Router } from 'express';
import { DataSovereigntyService } from '../services/DataSovereigntyService';

export const dataSovereigntyRouter = Router();

dataSovereigntyRouter.get('/', (_req, res) => {
  res.json({ success: true, data: DataSovereigntyService.getAll() });
});

dataSovereigntyRouter.get('/stats', (_req, res) => {
  res.json({ success: true, data: DataSovereigntyService.getStats() });
});

dataSovereigntyRouter.get('/:id', (req, res) => {
  const entry = DataSovereigntyService.getById(req.params.id);
  if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' });
  res.json({ success: true, data: entry });
});
