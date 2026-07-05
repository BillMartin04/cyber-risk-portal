import { Router, Request, Response } from 'express';
import { ResilienceService } from '../services/ResilienceService';

export const resilienceRouter = Router();

resilienceRouter.get('/stats',     (_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getStats()              }));
resilienceRouter.get('/trend',     (_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getMetricTrend()        }));
resilienceRouter.get('/services',  (_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getBusinessServices()   }));
resilienceRouter.get('/coverage',  (_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getDetectionCoverage()  }));
resilienceRouter.get('/playbooks', (_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getPlaybooks()          }));
resilienceRouter.get('/exercises', (_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getExercises()          }));
resilienceRouter.get('/categories',(_req: Request, res: Response) => res.json({ success: true, data: ResilienceService.getCategoryMetrics()    }));
