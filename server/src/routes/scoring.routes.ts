import { Router } from 'express';
import { ScoringService } from '../services/ScoringService';

export const scoringRouter = Router();

scoringRouter.get('/methodology', (_req, res) => {
  const data = ScoringService.getMethodology();
  res.json({ success: true, data });
});

scoringRouter.get('/domain-weights', (_req, res) => {
  const data = ScoringService.getDomainWeights();
  res.json({ success: true, data });
});

scoringRouter.get('/composite-score', (_req, res) => {
  const data = ScoringService.getCompositeScore();
  res.json({ success: true, data: { compositeScore: data } });
});
