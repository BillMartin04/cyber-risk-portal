import type { OverallStats, KRIWithDomain, ActionItem } from '../../models';

export interface IStatsService {
  getOverallStats(): OverallStats;
  getTopBreachingKRIs(limit?: number): KRIWithDomain[];
  getActionItems(limit?: number): ActionItem[];
}
