import { v4 as uuidv4 } from 'uuid';
import type { AIAssistRequest, AIAssistResponse, AgentAction } from './types';
import { GenAIService }   from './GenAIService';
import { AgenticService } from './AgenticService';

export interface IAIAssistService {
  process(req: AIAssistRequest): Promise<AIAssistResponse>;
  isLive(): boolean;
}

class AIAssistServiceImpl implements IAIAssistService {
  isLive(): boolean { return GenAIService.isAvailable(); }

  async process(req: AIAssistRequest): Promise<AIAssistResponse> {
    const content = await GenAIService.generate(req.action, req.context, req.prompt);

    let suggested: AgentAction[] | undefined;
    let requiresApproval = false;

    if (req.mode === 'agentic') {
      suggested      = this.buildSuggestedActions(req);
      requiresApproval = suggested.length > 0;
    }

    return {
      mode:    req.mode,
      action:  req.action,
      content,
      suggested,
      requiresApproval,
      model:     GenAIService.isAvailable() ? 'claude-sonnet-4-6' : 'fallback',
      timestamp: new Date().toISOString(),
    };
  }

  private buildSuggestedActions(req: AIAssistRequest): AgentAction[] {
    const actions: AgentAction[] = [];
    const ctx = req.context;

    if (req.action === 'draft-issue' && ctx.riskId) {
      actions.push(AgenticService.proposeAction(
        'Send Remediation Reminder',
        `Draft and queue a remediation reminder for all issue owners on risk ${ctx.riskName ?? ctx.riskId}`,
        'recommender',
        { jobType: 'RISK_ESCALATION', data: { riskId: ctx.riskId, riskName: ctx.riskName } },
      ));
    }

    if (req.action === 'analyze-controls' && ctx.domainId) {
      actions.push(AgenticService.proposeAction(
        'Request Evidence Collection',
        `Collect outstanding evidence artifacts for ${ctx.riskName ?? 'this risk'}`,
        'orchestrator',
        { jobType: 'EVIDENCE_COLLECTION', data: { riskId: ctx.riskId, riskName: ctx.riskName, artifactTypes: ['test-result', 'attestation'] } },
      ));
    }

    if (req.action === 'summarize') {
      actions.push(AgenticService.proposeAction(
        'Schedule Governance Review',
        `Add ${ctx.riskName ?? 'this risk'} to the next governance committee agenda`,
        'recommender',
        { jobType: 'ATTESTATION_REMINDER', data: { domainId: ctx.domainId, domainName: ctx.domainName } },
      ));
    }

    return actions;
  }
}

export const AIAssistService: IAIAssistService = new AIAssistServiceImpl();
