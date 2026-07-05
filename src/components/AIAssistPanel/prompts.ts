import type { AIAction } from '../../models';

export interface SuggestedPrompt {
  label:  string;
  prompt: string;
  action: AIAction;
}

export function getSuggestedPrompts(page: string): SuggestedPrompt[] {
  switch (page) {
    case 'dashboard':
      return [
        { label: 'Summarize risk posture',     prompt: 'Summarize the overall cyber risk posture including top risks and control gaps.',   action: 'summarize' },
        { label: 'Executive summary',           prompt: 'Draft a board-ready executive summary of current cyber risk status.',              action: 'report-draft' },
        { label: 'Top recommendations',         prompt: 'What are the top 5 control recommendations based on current risk levels?',         action: 'recommend-controls' },
        { label: 'Compliance overview',         prompt: 'Give me a compliance overview across NIST CSF, ISO 27001, GDPR and DORA.',        action: 'compliance-check' },
      ];
    case 'domain':
      return [
        { label: 'Analyze domain controls',    prompt: 'Analyze the controls for this domain and identify the most critical gaps.',       action: 'analyze-controls' },
        { label: 'Explain risk score',          prompt: 'Why is this domain risk score at its current level? Break down the drivers.',     action: 'risk-deep-dive' },
        { label: 'Recommend controls',          prompt: 'Recommend specific controls to reduce residual risk in this domain.',             action: 'recommend-controls' },
        { label: 'Policy guidance',             prompt: 'What policy requirements apply to this risk domain under DORA and ISO 27001?',    action: 'policy-guidance' },
      ];
    case 'risk':
      return [
        { label: 'Deep dive this risk',         prompt: 'Perform a deep dive analysis of this specific risk including threat landscape.',  action: 'risk-deep-dive' },
        { label: 'Draft risk issue',             prompt: 'Draft a formal risk issue for this risk including severity, owner and remediation plan.', action: 'draft-issue' },
        { label: 'Business impact translation', prompt: 'Translate this technical risk into business impact language for executives.',    action: 'impact-translation' },
        { label: 'Control analysis',            prompt: 'Analyze the effectiveness of controls mapped to this risk.',                      action: 'analyze-controls' },
      ];
    case 'ai-governance':
      return [
        { label: 'NIST AI RMF compliance',     prompt: 'Assess our AI governance posture against the NIST AI Risk Management Framework.', action: 'compliance-check' },
        { label: 'Shadow AI risks',             prompt: 'Identify and prioritise the risks associated with shadow AI in our environment.', action: 'risk-deep-dive' },
        { label: 'EU AI Act readiness',         prompt: 'What gaps exist in our EU AI Act compliance for high-risk AI systems?',          action: 'policy-guidance' },
        { label: 'OWASP LLM Top 10',           prompt: 'Summarise our exposure to the OWASP LLM Top 10 threats.',                        action: 'summarize' },
      ];
    case 'governance':
      return [
        { label: 'Policy compliance check',    prompt: 'Review policy compliance status and identify overdue reviews.',                   action: 'compliance-check' },
        { label: 'Exception risk analysis',    prompt: 'Analyse active risk exceptions and their cumulative risk exposure.',              action: 'risk-deep-dive' },
        { label: 'Committee briefing',         prompt: 'Draft a governance committee briefing on current risk appetite breaches.',        action: 'report-draft' },
        { label: 'Escalation guidance',        prompt: 'What risks should be escalated to the Risk Committee this quarter?',             action: 'policy-guidance' },
      ];
    case 'resilience':
      return [
        { label: 'Resilience posture',         prompt: 'Summarise the operational resilience posture and key gaps.',                     action: 'summarize' },
        { label: 'DORA compliance',            prompt: 'Assess our resilience controls against DORA requirements.',                      action: 'compliance-check' },
        { label: 'Recovery recommendations',   prompt: 'Recommend improvements to our recovery time objectives and playbooks.',          action: 'recommend-controls' },
        { label: 'Impact tolerance review',    prompt: 'Review whether our current impact tolerances meet FCA/PRA expectations.',        action: 'policy-guidance' },
      ];
    case 'evidence':
      return [
        { label: 'Evidence gaps',              prompt: 'Identify which controls have insufficient evidence coverage.',                   action: 'analyze-controls' },
        { label: 'Attestation status',         prompt: 'Summarise the attestation coverage and overdue items.',                         action: 'summarize' },
        { label: 'Audit readiness',            prompt: 'How audit-ready are we based on current evidence artefacts?',                   action: 'compliance-check' },
        { label: 'Evidence quality',           prompt: 'Assess the quality and completeness of evidence for high-risk controls.',       action: 'risk-deep-dive' },
      ];
    case 'identities':
      return [
        { label: 'High-risk identities',       prompt: 'Identify and explain the highest risk identities and why they are elevated.',   action: 'risk-deep-dive' },
        { label: 'Access review priorities',   prompt: 'Which access reviews should be prioritised and why?',                           action: 'analyze-controls' },
        { label: 'MFA coverage gaps',          prompt: 'Summarise MFA coverage gaps and the risk they create.',                        action: 'summarize' },
        { label: 'Privileged access risk',     prompt: 'Analyse the risk from privileged accounts and recommend controls.',             action: 'recommend-controls' },
      ];
    default:
      return [
        { label: 'General risk summary',       prompt: 'Provide a general cyber risk summary for this view.',                           action: 'summarize' },
        { label: 'Recommendations',            prompt: 'What are your top recommendations for improving cyber risk posture?',           action: 'recommend-controls' },
        { label: 'Compliance check',           prompt: 'Check compliance status against applicable frameworks.',                        action: 'compliance-check' },
      ];
  }
}
