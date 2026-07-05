import { Router, Request, Response } from 'express';
import { AIGovernanceService } from '../services/AIGovernanceService';

export const aiGovernanceRouter = Router();

aiGovernanceRouter.get('/stats',            (_req: Request, res: Response) => res.json({ success: true, data: AIGovernanceService.getGovernanceStats()   }));
aiGovernanceRouter.get('/models',           (_req: Request, res: Response) => res.json({ success: true, data: AIGovernanceService.getAllModels()         }));
aiGovernanceRouter.get('/threats',          (_req: Request, res: Response) => res.json({ success: true, data: AIGovernanceService.getOWASPThreats()      }));
aiGovernanceRouter.get('/nist-domains',     (_req: Request, res: Response) => res.json({ success: true, data: AIGovernanceService.getNISTDomains()       }));
aiGovernanceRouter.get('/shadow-incidents', (_req: Request, res: Response) => res.json({ success: true, data: AIGovernanceService.getShadowAIIncidents() }));
