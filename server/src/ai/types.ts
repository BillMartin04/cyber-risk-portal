export type AIMode     = 'generative' | 'agentic';
export type AIAction   = 'summarize' | 'analyze-controls' | 'draft-issue' | 'policy-guidance' | 'impact-translation' | 'report-draft' | 'recommend-controls';
export type AgentTier  = 'observer' | 'recommender' | 'orchestrator' | 'executor';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AIAssistRequest {
  mode:     AIMode;
  action:   AIAction;
  context:  AIContext;
  prompt?:  string;
}

export interface AIContext {
  riskId?:      string;
  riskName?:    string;
  domainId?:    string;
  domainName?:  string;
  controls?:    unknown[];
  issues?:      unknown[];
  evidence?:    unknown[];
  residualRisk?: string;
  inherentRisk?: string;
  [key: string]: unknown;
}

export interface AIAssistResponse {
  mode:       AIMode;
  action:     AIAction;
  content:    string;
  suggested?: AgentAction[];
  requiresApproval: boolean;
  model:      string;
  timestamp:  string;
}

export interface AgentAction {
  id:          string;
  label:       string;
  description: string;
  tier:        AgentTier;
  payload:     unknown;
  status:      ApprovalStatus;
  createdAt:   string;
}

export interface ApprovalQueueItem {
  id:        string;
  action:    AgentAction;
  requestedBy: string;
  createdAt:  string;
  decidedAt?: string;
  decidedBy?: string;
  status:     ApprovalStatus;
  note?:      string;
}
