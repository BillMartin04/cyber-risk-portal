import { Router, Request, Response } from 'express';
import { EvidenceService } from '../services/EvidenceService';

export const evidenceRouter = Router();

evidenceRouter.get('/stats',        (_req: Request, res: Response) => res.json({ success: true, data: EvidenceService.getStats()        }));
evidenceRouter.get('/artifacts',    (_req: Request, res: Response) => res.json({ success: true, data: EvidenceService.getAllArtifacts() }));
evidenceRouter.get('/trail',        (_req: Request, res: Response) => res.json({ success: true, data: EvidenceService.getAuditTrail()   }));
evidenceRouter.get('/attestations', (_req: Request, res: Response) => res.json({ success: true, data: EvidenceService.getAttestations() }));
evidenceRouter.get('/artifacts/risk/:riskId', (req: Request, res: Response) =>
  res.json({ success: true, data: EvidenceService.getArtifactsByRiskId(req.params.riskId) }));
