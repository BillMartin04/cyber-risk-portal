import Anthropic from '@anthropic-ai/sdk';
import type { AIContext, AIAction } from './types';

export interface IGenAIService {
  generate(action: AIAction, context: AIContext, userPrompt?: string): Promise<string>;
  isAvailable(): boolean;
}

const SYSTEM_PROMPT = `You are an expert cyber risk and AI governance analyst embedded in Lumina, a CyberLens for GRC platform.
You help risk owners, control owners, and governance teams understand, communicate, and manage cyber risk.
Your responses are always:
- Concise, professional, and governance-grade
- Grounded in the specific risk context provided
- Aligned to NIST CSF 2.0, NIST AI RMF, OWASP LLM Top 10, EU AI Act, GDPR, DORA, and ISO 27001
- Written for the audience specified (board, audit, operational, legal, etc.)
Never fabricate risk scores, control names, or regulatory references not present in the context.`;

const ACTION_PROMPTS: Record<AIAction, (ctx: AIContext) => string> = {
  summarize: (ctx) => `Summarize the following cyber risk for a governance board audience. Be concise (3-5 sentences max).
Risk: ${ctx.riskName ?? 'Unknown'} | Domain: ${ctx.domainName ?? 'Unknown'}
Inherent Risk: ${ctx.inherentRisk ?? 'N/A'} | Residual Risk: ${ctx.residualRisk ?? 'N/A'}
Controls: ${JSON.stringify(ctx.controls ?? [])}
Issues: ${JSON.stringify(ctx.issues ?? [])}`,

  'analyze-controls': (ctx) => `Analyze the control effectiveness for this risk and identify the top 3 gaps and recommended improvements.
Risk: ${ctx.riskName ?? 'Unknown'} | Residual Risk: ${ctx.residualRisk ?? 'N/A'}
Controls: ${JSON.stringify(ctx.controls ?? [])}`,

  'draft-issue': (ctx) => `Draft a professional remediation plan for the following open issues. Include owner actions, timelines, and dependencies.
Risk: ${ctx.riskName ?? 'Unknown'}
Issues: ${JSON.stringify(ctx.issues ?? [])}`,

  'policy-guidance': (ctx) => `Provide clear, plain-language policy guidance for this AI risk scenario. Explain what is allowed, what is prohibited, and what reviews are required.
Context: ${ctx.riskName ?? 'Unknown'} | Domain: ${ctx.domainName ?? 'Unknown'}`,

  'impact-translation': (ctx) => `Translate this technical cyber risk into clear business, legal, privacy, and customer-impact language suitable for an executive audience.
Risk: ${ctx.riskName ?? 'Unknown'} | Domain: ${ctx.domainName ?? 'Unknown'}
Inherent Risk: ${ctx.inherentRisk ?? 'N/A'} | Residual Risk: ${ctx.residualRisk ?? 'N/A'}`,

  'report-draft': (ctx) => `Generate a governance committee report section for this risk. Include: current status, key metrics, open issues, and recommended board actions.
Risk: ${ctx.riskName ?? 'Unknown'} | Domain: ${ctx.domainName ?? 'Unknown'}
Controls: ${JSON.stringify(ctx.controls ?? [])}
Evidence: ${JSON.stringify(ctx.evidence ?? [])}`,

  'recommend-controls': (ctx) => `Based on this risk profile and open issues, recommend 3-5 additional or enhanced controls with implementation priority and rationale.
Risk: ${ctx.riskName ?? 'Unknown'} | Residual Risk: ${ctx.residualRisk ?? 'N/A'}
Existing Controls: ${JSON.stringify(ctx.controls ?? [])}
Issues: ${JSON.stringify(ctx.issues ?? [])}`,
};

// Fallback responses when API key is not configured
const FALLBACK_RESPONSES: Record<AIAction, (ctx: AIContext) => string> = {
  summarize: (ctx) => `**Risk Summary — ${ctx.riskName ?? 'Unknown Risk'}**\n\nThis ${ctx.residualRisk ?? 'elevated'}-rated risk in the ${ctx.domainName ?? 'cyber'} domain represents a significant exposure requiring active management. Current residual risk stands at **${ctx.residualRisk ?? 'High'}** following application of ${(ctx.controls as unknown[])?.length ?? 0} controls. ${(ctx.issues as unknown[])?.length ?? 0} open issues require remediation to reduce exposure to acceptable levels. Board attention is recommended given the current breach of risk appetite thresholds.`,

  'analyze-controls': (ctx) => `**Control Gap Analysis — ${ctx.riskName ?? 'Unknown Risk'}**\n\n**Gap 1 — Low Automation:** Several controls rely on manual processes, increasing operational risk and reducing consistency of execution.\n\n**Gap 2 — Attestation Currency:** One or more controls have upcoming attestation deadlines that require immediate owner action to maintain compliance evidence.\n\n**Gap 3 — Coverage Gaps:** The current control set does not fully address all identified risk vectors. Recommend adding detective controls to complement existing preventive controls.\n\n**Recommendation:** Prioritise automation of manual controls and complete outstanding attestations within 30 days.`,

  'draft-issue': (ctx) => `**Remediation Plan — ${ctx.riskName ?? 'Unknown Risk'}**\n\n**Immediate Actions (0-30 days):**\n- Assign dedicated resource to lead remediation\n- Conduct root cause analysis for each open issue\n- Establish weekly status checkpoint with risk owner\n\n**Short-term Actions (30-90 days):**\n- Implement technical controls to address identified gaps\n- Complete evidence collection and documentation\n- Submit updated risk rating for review\n\n**Dependencies:** IT Operations, Legal, Compliance sign-off required before closure.`,

  'policy-guidance': (ctx) => `**Policy Guidance — ${ctx.riskName ?? 'AI Governance'}**\n\n**Permitted:** Use of enterprise-approved AI tools with completed Data Processing Agreements, security review, and data classification assessment.\n\n**Prohibited:** Use of public AI tools (ChatGPT, Gemini, etc.) for tasks involving customer PII, trade secrets, confidential financial data, or regulated information without explicit CISO approval.\n\n**Required Reviews:** Security Review → Legal Review → Privacy/DPA → Governance Board approval before any new AI tool deployment in production.`,

  'impact-translation': (ctx) => `**Business Impact — ${ctx.riskName ?? 'Unknown Risk'}**\n\n**Customer Impact:** Potential exposure of customer data could result in loss of trust, regulatory complaints, and churn.\n\n**Financial Impact:** Regulatory fines under GDPR (up to 4% of global turnover), DORA penalties, and reputational damage could materially affect revenue.\n\n**Legal/Regulatory:** Breach of GDPR Art. 32, EU AI Act obligations, and DORA ICT risk management requirements creates direct regulatory exposure.\n\n**Operational:** Business continuity risk if controls fail during peak transaction periods.`,

  'report-draft': (ctx) => `**Governance Committee Report — ${ctx.riskName ?? 'Unknown Risk'}**\n\n**Status:** Active — Residual risk rated ${ctx.residualRisk ?? 'High'}\n\n**Key Metrics:**\n- ${(ctx.controls as unknown[])?.length ?? 0} controls in place | Average effectiveness: TBD\n- ${(ctx.issues as unknown[])?.length ?? 0} open issues | ${(ctx.evidence as unknown[])?.length ?? 0} evidence artifacts\n\n**Open Items:** Remediation actions in progress. Owner accountability confirmed.\n\n**Board Recommendation:** Note current risk status and request 30-day remediation update at next committee meeting.`,

  'recommend-controls': (ctx) => `**Recommended Additional Controls — ${ctx.riskName ?? 'Unknown Risk'}**\n\n1. **Automated Continuous Monitoring** (Priority: High) — Deploy automated scanning to detect control gaps in real-time rather than relying on periodic attestation.\n\n2. **Enhanced Logging & SIEM Integration** (Priority: High) — Ensure all relevant events are captured in SIEM for detection and response.\n\n3. **Privileged Access Review Automation** (Priority: Medium) — Automate quarterly access reviews to reduce manual effort and improve completeness.\n\n4. **Third-Party Risk Integration** (Priority: Medium) — Extend control monitoring to critical vendor dependencies.\n\n5. **Compensating Control Documentation** (Priority: Low) — Formally document all compensating controls with approval evidence.`,
};

class GenAIServiceImpl implements IGenAIService {
  private readonly client: Anthropic | null;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    this.client  = apiKey ? new Anthropic({ apiKey }) : null;
    if (!this.client) {
      console.warn('[GenAIService] ANTHROPIC_API_KEY not set — using fallback responses');
    }
  }

  isAvailable(): boolean { return this.client !== null; }

  async generate(action: AIAction, context: AIContext, userPrompt?: string): Promise<string> {
    if (!this.client) {
      return FALLBACK_RESPONSES[action]?.(context) ?? 'AI service not configured. Please set ANTHROPIC_API_KEY.';
    }

    const prompt = userPrompt ?? ACTION_PROMPTS[action]?.(context) ?? 'Assist with this cyber risk management task.';

    const response = await this.client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: prompt }],
    });

    const block = response.content[0];
    return block.type === 'text' ? block.text : 'Unable to generate response.';
  }
}

export const GenAIService: IGenAIService = new GenAIServiceImpl();
