import type {
  MetricPoint, IncidentCategoryMetric, BusinessService,
  DetectionCoverage, Playbook, ScenarioExercise,
} from '../models';
import {
  METRIC_TREND, CATEGORY_METRICS, BUSINESS_SERVICES,
  DETECTION_COVERAGE, PLAYBOOKS, EXERCISES,
} from '../data/resilienceData';

export interface IResilienceRepository {
  getMetricTrend(): MetricPoint[];
  getCategoryMetrics(): IncidentCategoryMetric[];
  getBusinessServices(): BusinessService[];
  getDetectionCoverage(): DetectionCoverage[];
  getPlaybooks(): Playbook[];
  getExercises(): ScenarioExercise[];
}

class ResilienceRepositoryImpl implements IResilienceRepository {
  constructor(
    private readonly trend:      readonly MetricPoint[],
    private readonly categories: readonly IncidentCategoryMetric[],
    private readonly services:   readonly BusinessService[],
    private readonly coverage:   readonly DetectionCoverage[],
    private readonly playbooks:  readonly Playbook[],
    private readonly exercises:  readonly ScenarioExercise[],
  ) {}

  getMetricTrend():      MetricPoint[]            { return [...this.trend]; }
  getCategoryMetrics():  IncidentCategoryMetric[] { return [...this.categories]; }
  getBusinessServices(): BusinessService[]         { return [...this.services]; }
  getDetectionCoverage():DetectionCoverage[]       { return [...this.coverage]; }
  getPlaybooks():        Playbook[]                { return [...this.playbooks]; }
  getExercises():        ScenarioExercise[]        { return [...this.exercises]; }
}

export const resilienceRepository: IResilienceRepository = new ResilienceRepositoryImpl(
  METRIC_TREND, CATEGORY_METRICS, BUSINESS_SERVICES,
  DETECTION_COVERAGE, PLAYBOOKS, EXERCISES,
);
