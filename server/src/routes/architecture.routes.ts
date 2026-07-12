import { Router } from 'express';
import { ArchitectureService } from '../services/ArchitectureService';

export const architectureRouter = Router();

architectureRouter.get('/',           (_req, res) => res.json({ success: true, data: ArchitectureService.getData() }));
architectureRouter.get('/agents',     (_req, res) => res.json({ success: true, data: ArchitectureService.getAgents() }));
architectureRouter.get('/models',     (_req, res) => res.json({ success: true, data: ArchitectureService.getModels() }));
architectureRouter.get('/containment',(_req, res) => res.json({ success: true, data: ArchitectureService.getContainmentBoundaries() }));
