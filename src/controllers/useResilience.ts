import { useMemo } from 'react';
import { ResilienceService } from '../services/ResilienceService';
import type {
  MetricPoint, IncidentCategoryMetric, BusinessService,
  DetectionCoverage, Playbook, ScenarioExercise, ResilienceStats,
} from '../models';

export interface ResilienceViewModel {
  trend:          MetricPoint[];
  categoryMetrics:IncidentCategoryMetric[];
  services:       BusinessService[];
  coverage:       DetectionCoverage[];
  playbooks:      Playbook[];
  exercises:      ScenarioExercise[];
  stats:          ResilienceStats;
}

export function useResilience(): ResilienceViewModel {
  const trend           = useMemo(() => ResilienceService.getMetricTrend(),       []);
  const categoryMetrics = useMemo(() => ResilienceService.getCategoryMetrics(),   []);
  const services        = useMemo(() => ResilienceService.getBusinessServices(),  []);
  const coverage        = useMemo(() => ResilienceService.getDetectionCoverage(), []);
  const playbooks       = useMemo(() => ResilienceService.getPlaybooks(),         []);
  const exercises       = useMemo(() => ResilienceService.getExercises(),         []);
  const stats           = useMemo(() => ResilienceService.getStats(),             []);

  return { trend, categoryMetrics, services, coverage, playbooks, exercises, stats };
}
