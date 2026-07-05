from datetime import datetime
from app.interfaces.i_gen_ai_service import IGenAIService
from app.models.schemas import AIAssistRequest, AIAssistResponse, AgentActionSuggestion
from app.core.client import get_anthropic_client
from app.core.config import get_settings

SYSTEM_PROMPT = """You are a senior cyber risk analyst and AI governance expert embedded in a 1st Line of Defence Cyber Risk Portal.
Your role: provide concise, actionable, evidence-based analysis grounded in NIST CSF 2.0, NIST AI RMF, ISO 27001, GDPR, DORA, OWASP LLM Top 10, and EU AI Act.
Always be direct, risk-aware, and frame recommendations in business impact terms.
Format responses with clear sections using markdown. Keep responses under 400 words unless asked otherwise."""

FALLBACK_RESPONSES: dict[str, str] = {
    "summarize": """## Risk Summary

**Current Posture:** The domain reflects a moderate-to-high inherent risk profile with partial control coverage.

**Key Observations:**
- Control gaps identified in access management and monitoring layers
- Residual risk remains above appetite threshold in 2 of 5 assessed areas
- Recent incidents indicate need for enhanced detection capability

**Priority Actions:**
1. Remediate access control deficiencies within 30 days
2. Implement continuous monitoring for anomaly detection
3. Schedule control effectiveness review with risk owner

*This analysis is based on current KRI data and last attestation cycle.*""",

    "analyze-controls": """## Control Analysis

**Effective Controls:**
- Preventive: MFA enforcement, network segmentation ✅
- Detective: SIEM alerting, log aggregation ✅

**Control Gaps:**
- Compensating controls missing for legacy system access
- Privileged access review cadence is quarterly (recommend monthly)
- No automated evidence collection for 3 of 8 mapped controls

**NIST CSF 2.0 Mapping:**
- PR.AA (Access Control): Partially implemented
- DE.CM (Monitoring): Needs improvement
- RS.MA (Incident Management): Adequate

**Recommendation:** Prioritize automated control testing to reduce manual attestation burden and improve assurance frequency.""",

    "draft-issue": """## Drafted Risk Issue

**Issue Title:** Insufficient Privileged Access Management Controls

**Severity:** High | **Rating:** 7.8/10

**Description:**
Current privileged access review processes rely on manual attestation cycles conducted quarterly. This cadence creates extended windows where dormant or inappropriate access persists undetected.

**Root Cause:** Absence of automated PAM tooling and integration with HR offboarding workflows.

**Business Impact:** Potential for insider threat or compromised credential exploitation affecting core banking systems.

**Remediation Plan:**
1. Deploy PAM solution with automated session recording (90 days)
2. Integrate with HR system for real-time offboarding triggers (60 days)
3. Reduce review cycle to monthly with automated reporting (30 days)

**Owner:** CISO Office | **Target Date:** Q2 2026""",

    "policy-guidance": """## Policy Guidance

**Applicable Frameworks:**
- **ISO 27001 A.9** — Access Control
- **NIST CSF 2.0 PR.AA** — Identity Management and Access Control
- **GDPR Art. 32** — Security of Processing
- **DORA Art. 9** — ICT Security Policies

**Key Policy Requirements:**
1. All privileged access must follow least-privilege principle
2. Access reviews must be documented and retained for audit
3. Separation of duties required for critical financial processes
4. Multi-factor authentication mandatory for all administrative access

**Compliance Gap:** Current quarterly review cycle does not meet DORA's requirement for continuous monitoring of critical ICT functions.

**Recommended Policy Update:** Revise access management policy to mandate monthly review cycles with automated tooling.""",

    "impact-translation": """## Business Impact Translation

**Technical Risk → Business Language:**

| Technical Finding | Business Impact |
|---|---|
| Unpatched critical CVEs | £2.3M potential breach cost (IBM Cost of Data Breach 2024) |
| Missing MFA on admin accounts | Regulatory fine risk up to 4% annual turnover (GDPR) |
| Inadequate logging | Failed audit = license revocation risk |
| Legacy system access gaps | Operational disruption to 3 core business processes |

**Executive Summary:**
The identified control gaps create a combined exposure of approximately £4.1M in potential regulatory, operational, and reputational costs. Remediation investment of ~£180K delivers a 22:1 risk reduction ratio.

**Risk Appetite Breach:** Current posture exceeds board-approved risk appetite. Escalation to Risk Committee recommended.""",

    "recommend-controls": """## Recommended Controls

**Immediate (0-30 days):**
1. Enable MFA on all privileged accounts — Low cost, High impact
2. Review and revoke dormant access (90+ days inactive) — Immediate risk reduction
3. Enable enhanced logging for privileged sessions

**Short-term (30-90 days):**
1. Deploy automated access certification workflow
2. Implement just-in-time privileged access provisioning
3. Integrate threat intelligence feeds with SIEM

**Strategic (90-180 days):**
1. Implement Zero Trust network segmentation
2. Deploy User and Entity Behaviour Analytics (UEBA)
3. Establish continuous control monitoring with automated evidence collection

**NIST CSF 2.0 Alignment:** These controls address gaps across Identify (ID.AM), Protect (PR.AA, PR.PS), and Detect (DE.CM) functions.""",

    "report-draft": """## Risk Report Draft

**CONFIDENTIAL — FOR RISK COMMITTEE REVIEW**
**Period:** Q2 2026 | **Prepared by:** 1st Line Cyber Risk Function

### Executive Summary
The cyber risk posture for the reporting period reflects continued moderate exposure with specific gaps in access governance and AI model oversight. Three risks exceed appetite thresholds and require committee attention.

### Material Risks
1. **Privileged Access Management** — High | Residual: 7.8/10
2. **Shadow AI Proliferation** — High | Residual: 6.9/10
3. **Third-Party API Dependency** — Medium | Residual: 5.4/10

### Control Performance
- 78% of controls operating effectively (target: 85%)
- 4 controls in remediation
- 2 control failures reported and under investigation

### Actions Required
The Risk Committee is requested to note the above exposures and approve the proposed remediation timelines.""",

    "risk-deep-dive": """## Risk Deep Dive Analysis

**Inherent Risk Assessment:**
The risk exhibits high likelihood (4/5) and significant impact (4/5) giving an inherent risk score of 16/25 (High).

**Threat Landscape:**
- External threat actors targeting sector: Elevated (NCSC Advisory Q1 2026)
- Insider threat indicators: 2 flagged events in past 90 days
- Third-party risk vectors: 3 suppliers with access to affected systems

**Control Effectiveness Breakdown:**
- Preventive controls: 65% effective
- Detective controls: 72% effective
- Corrective controls: 80% effective

**Residual Risk Calculation:**
Inherent Risk (16) × Control Effectiveness Gap (0.68) = **Residual Risk: 10.9/25 (High)**

**Trend:** Deteriorating — residual risk increased 15% vs prior quarter due to new threat intelligence and control degradation.""",

    "compliance-check": """## Compliance Assessment

**Frameworks Assessed:** NIST CSF 2.0, ISO 27001:2022, GDPR, DORA, EU AI Act

**NIST CSF 2.0:**
- GV (Govern): 72% — Policy framework needs refresh
- ID (Identify): 68% — Asset inventory gaps
- PR (Protect): 74% — Control gaps in access layer
- DE (Detect): 61% — Monitoring coverage below target
- RS (Respond): 80% — IR procedures adequate
- RC (Recover): 75% — BCP tested annually

**GDPR Status:** Partially compliant — Data retention schedules require update

**DORA Status:** Gap identified in ICT incident reporting timelines (Art. 19)

**EU AI Act:** High-risk AI system inventory not complete (Art. 9 requirement)

**Overall Compliance Score: 72%** | Target: 85% by end of year"""
}


def _build_suggested_actions(action: str, context: dict) -> list[AgentActionSuggestion]:
    base: list[AgentActionSuggestion] = []
    if action in ("analyze-controls", "risk-deep-dive"):
        base.append(AgentActionSuggestion(
            action="schedule-attestation",
            description="Schedule control attestation for identified gaps",
            impact="Automated attestation request sent to control owners",
            risk_level="medium",
            tier="executor",
        ))
    if action in ("draft-issue", "report-draft"):
        base.append(AgentActionSuggestion(
            action="create-workflow",
            description="Initiate governance workflow for this risk issue",
            impact="Creates a tracked workflow with approval stages",
            risk_level="low",
            tier="analyst",
        ))
    if action == "recommend-controls":
        base.append(AgentActionSuggestion(
            action="enqueue-remediation",
            description="Queue remediation tasks for recommended controls",
            impact="Tasks queued for risk owners with deadlines",
            risk_level="medium",
            tier="executor",
        ))
    return base


class GenAIServiceImpl(IGenAIService):
    """
    Implements IGenAIService using the Anthropic Python SDK.
    Falls back to pre-written responses when no API key is configured.
    SRP: only handles text generation. DIP: depends on client abstraction.
    """

    def is_live(self) -> bool:
        return get_settings().has_api_key

    async def assist(self, request: AIAssistRequest) -> AIAssistResponse:
        settings = get_settings()

        if not self.is_live():
            return self._fallback(request)

        client = get_anthropic_client()
        messages = [
            {"role": m.role, "content": m.content}
            for m in request.conversation_history
        ]
        messages.append({"role": "user", "content": self._build_user_prompt(request)})

        resp = client.messages.create(
            model=settings.model_id,
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

        return AIAssistResponse(
            response=resp.content[0].text,
            mode=request.mode,
            action=request.action,
            suggested_agent_actions=_build_suggested_actions(request.action, request.context),
            tokens_used=resp.usage.input_tokens + resp.usage.output_tokens,
            model=settings.model_id,
        )

    def _build_user_prompt(self, request: AIAssistRequest) -> str:
        ctx_lines = "\n".join(f"- {k}: {v}" for k, v in request.context.items() if v)
        return f"""Action requested: {request.action}

Context:
{ctx_lines or '(no additional context provided)'}

User request: {request.prompt}"""

    def _fallback(self, request: AIAssistRequest) -> AIAssistResponse:
        text = FALLBACK_RESPONSES.get(
            request.action,
            f"## Analysis\n\nProcessing your request for **{request.action}**. Configure `ANTHROPIC_API_KEY` in `ai-service/.env` to enable live Claude responses."
        )
        return AIAssistResponse(
            response=text,
            mode=request.mode,
            action=request.action,
            suggested_agent_actions=_build_suggested_actions(request.action, request.context),
            model="fallback-mode",
        )


gen_ai_service: IGenAIService = GenAIServiceImpl()
