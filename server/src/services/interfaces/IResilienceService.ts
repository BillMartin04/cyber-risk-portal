import type {
  MetricPoint, IncidentCategoryMetric, BusinessService,
  DetectionCoverage, Playbook, ScenarioExercise, ResilienceStats,
} from '../../models';

export interface IResilienceService {
  getMetricTrend(): MetricPoint[];
  getCategoryMetrics(): IncidentCategoryMetric[];
  getBusinessServices(): BusinessService[];
  getDetectionCoverage(): DetectionCoverage[];
  getPlaybooks(): Playbook[];
  getExercises(): ScenarioExercise[];
  getStats(): ResilienceStats;
}
