import { Router, Request, Response } from 'express';
import { GovernanceService } from '../services/GovernanceService';

export const governanceRouter = Router();

governanceRouter.get('/stats',       (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getStats()              }));
governanceRouter.get('/appetite',    (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getRiskAppetite()       }));
governanceRouter.get('/exceptions',  (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getActiveExceptions()   }));
governanceRouter.get('/policies',    (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getPolicies()           }));
governanceRouter.get('/committees',  (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getCommittees()         }));
governanceRouter.get('/decisions',   (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getAllDecisions()       }));
governanceRouter.get('/escalations', (_req: Request, res: Response) => res.json({ success: true, data: GovernanceService.getEscalationRules()   }));
