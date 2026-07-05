import type {
  MetricPoint, IncidentCategoryMetric, BusinessService,
  DetectionCoverage, Playbook, ScenarioExercise, ResilienceStats,
} from '../models';
import type { IResilienceRepository } from '../repositories/ResilienceRepository';
import { resilienceRepository } from '../repositories/ResilienceRepository';
import type { IResilienceService } from './interfaces/IResilienceService';

class ResilienceServiceImpl implements IResilienceService {
  constructor(private readonly repo: IResilienceRepository) {}

  getMetricTrend(): MetricPoint[] {
    return this.repo.getMetricTrend();
  }

  getCategoryMetrics(): IncidentCategoryMetric[] {
    return this.repo.getCategoryMetrics();
  }

  getBusinessServices(): BusinessService[] {
    return this.repo.getBusinessServices();
  }

  getDetectionCoverage(): DetectionCoverage[] {
    return this.repo.getDetectionCoverage().sort((a, b) => b.coverage - a.coverage);
  }

  getPlaybooks(): Playbook[] {
    return this.repo.getPlaybooks();
  }

  getExercises(): ScenarioExercise[] {
    return this.repo.getExercises().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  getStats(): ResilienceStats {
    const trend     = this.repo.getMetricTrend();
    const latest    = trend[trend.length - 1];
    const coverage  = this.repo.getDetectionCoverage();
    const playbooks = this.repo.getPlaybooks();
    const exercises = this.repo.getExercises();
    const services  = this.repo.getBusinessServices();

    const avgDetection = Math.round(
      coverage.reduce((s, c) => s + c.coverage, 0) / coverage.length,
    );

    const lastExercise  = exercises.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];
    const lastDays = lastExercise
      ? Math.floor((Date.now() - new Date(lastExercise.date).getTime()) / 86_400_000)
      : 999;

    return {
      avgMTTD:          latest?.mttd ?? 0,
      avgMTTC:          latest?.mttc ?? 0,
      avgMTTR:          latest?.mttr ?? 0,
      mttdTarget:       2,
      mttcTarget:       4,
      mttrTarget:       12,
      detectionRate:    avgDetection,
      detectionTarget:  95,
      playbooksTested:  playbooks.filter(p => p.status === 'tested').length,
      playbooksTotal:   playbooks.length,
      criticalServices: services.filter(s => s.tier === 'tier-1').length,
      servicesRTOMet:   services.filter(s => s.rtoMet).length,
      lastExerciseDays: lastDays,
    };
  }
}

export const ResilienceService: IResilienceService =
  new ResilienceServiceImpl(resilienceRepository);
