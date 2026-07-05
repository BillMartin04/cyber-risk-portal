export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type ControlStatus = 'implemented' | 'partial' | 'not-implemented' | 'not-applicable';
export type ControlType = 'preventive' | 'detective' | 'corrective' | 'compensating';
export type TrendDirection = 'improving' | 'stable' | 'degrading';
export type RiskLifecycle = 'draft' | 'assess' | 'respond' | 'review' | 'monitor' | 'retired';
export type MaturityLevel = 'ad-hoc' | 'systemized' | 'optimized' | 'connected' | 'integrated';

export interface Control {
  id: string;
  name: string;
  description: string;
  type: ControlType;
  status: ControlStatus;
  effectiveness: number;
  owner: string;
  lastAttested: string;
  nextAttestation: string;
  frequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  automationLevel: 'manual' | 'semi-automated' | 'automated';
  framework?: string;
}

export interface Issue {
  id: string;
  title: string;
  severity: RiskLevel;
  status: 'open' | 'in-progress' | 'pending-review' | 'closed';
  owner: string;
  dueDate: string;
  daysOverdue?: number;
  rootCause?: string;
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  businessImpact: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  inherentRisk: RiskLevel;
  inherentScore: number;
  residualRisk: RiskLevel;
  residualScore: number;
  owner: string;
  businessUnit: string;
  lifecycle: RiskLifecycle;
  controls: Control[];
  issues: Issue[];
  lastAssessed: string;
  nextReview: string;
  trend: TrendDirection;
  regulatoryRefs: string[];
}

export interface KRI {
  id: string;
  name: string;
  value: number;
  threshold: number;
  unit: string;
  trend: TrendDirection;
  status: 'within' | 'at-risk' | 'breach';
}

export interface Domain {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  description: string;
  risks: Risk[];
  riskScore: number;
  trend: TrendDirection;
  lastAssessed: string;
  owner: string;
  ownerRole: string;
  kris: KRI[];
  maturityLevel: MaturityLevel;
}
