"""
LangGraph Compliance Agent.
Assesses control maturity against multiple regulatory frameworks simultaneously.
"""
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from typing import TypedDict
from app.core.client import get_chat_model
from app.core.config import get_settings


class ComplianceState(TypedDict):
    messages: list
    frameworks_checked: list[str]
    gaps: list[dict]
    overall_score: float


COMPLIANCE_DB = {
    "NIST_CSF": {
        "GV": {"weight": 0.15, "controls": ["GV.OC", "GV.RM", "GV.RR", "GV.PO", "GV.OV", "GV.SC"]},
        "ID": {"weight": 0.20, "controls": ["ID.AM", "ID.RA", "ID.IM"]},
        "PR": {"weight": 0.25, "controls": ["PR.AA", "PR.AT", "PR.DS", "PR.PS", "PR.IR"]},
        "DE": {"weight": 0.20, "controls": ["DE.CM", "DE.AE"]},
        "RS": {"weight": 0.10, "controls": ["RS.MA", "RS.AN", "RS.CO", "RS.MI"]},
        "RC": {"weight": 0.10, "controls": ["RC.RP", "RC.CO"]},
    },
    "ISO_27001": {
        "A.5": {"weight": 0.10, "title": "Organisational controls"},
        "A.6": {"weight": 0.08, "title": "People controls"},
        "A.7": {"weight": 0.08, "title": "Physical controls"},
        "A.8": {"weight": 0.74, "title": "Technological controls"},
    },
    "DORA": {
        "Art.5-16": {"weight": 0.40, "title": "ICT Risk Management"},
        "Art.17-23": {"weight": 0.30, "title": "ICT Incident Management"},
        "Art.24-27": {"weight": 0.15, "title": "DORA Testing"},
        "Art.28-44": {"weight": 0.15, "title": "Third-Party Risk"},
    },
}


@tool
def assess_framework_compliance(framework: str, domain: str, evidence_score: float) -> dict:
    """
    Assess compliance against a specific framework and domain.
    evidence_score: 0.0 (no evidence) to 1.0 (fully evidenced)
    Returns compliance percentage, gaps, and required actions.
    """
    framework_data = COMPLIANCE_DB.get(framework, {})
    if not framework_data:
        return {"error": f"Framework '{framework}' not in database. Supported: NIST_CSF, ISO_27001, DORA"}

    gaps = []
    if evidence_score < 0.6:
        gaps.append(f"Evidence collection below threshold for {domain} ({evidence_score*100:.0f}%)")
    if evidence_score < 0.8:
        gaps.append(f"Control documentation incomplete — requires formal attestation")
    if evidence_score < 1.0:
        gaps.append(f"Continuous monitoring not fully implemented for {domain}")

    return {
        "framework": framework,
        "domain": domain,
        "compliance_pct": round(evidence_score * 100, 1),
        "status": "Compliant" if evidence_score >= 0.85 else "Partially Compliant" if evidence_score >= 0.6 else "Non-Compliant",
        "gaps": gaps,
        "required_actions": [f"Close evidence gap for {g}" for g in gaps[:2]],
    }


@tool
def get_regulatory_deadline(regulation: str) -> str:
    """Get key regulatory deadlines and upcoming requirements."""
    deadlines = {
        "DORA": "DORA fully applicable since 17 Jan 2025. ICT incident reports must be submitted within 4 hours of major incident detection.",
        "EU AI Act": "High-risk AI systems must comply by Aug 2026. General-purpose AI model rules apply from Aug 2025.",
        "GDPR": "Ongoing. Data breach notification: 72 hours to supervisory authority. No upcoming major deadline changes.",
        "ISO 27001:2022": "Transition from 2013 edition required by Oct 2025. Recertification audit should be scheduled.",
        "NIS2": "Transposition deadline was Oct 2024. Incident reporting: 24h early warning, 72h notification, 1 month final report.",
    }
    return deadlines.get(regulation, f"Check official sources for {regulation} deadlines.")


@tool
def identify_compliance_gaps(domains: str, target_score: float) -> list:
    """Identify which compliance domains fall below the target score threshold."""
    sample_scores = {
        "Access Management": 0.74,
        "Data Protection": 0.81,
        "Incident Response": 0.79,
        "Third-Party Risk": 0.63,
        "AI Governance": 0.58,
        "Business Continuity": 0.77,
        "Change Management": 0.85,
        "Vulnerability Management": 0.70,
    }
    gaps = [
        {"domain": d, "score": s, "gap": round((target_score - s) * 100, 1)}
        for d, s in sample_scores.items()
        if s < target_score
    ]
    return sorted(gaps, key=lambda x: x["score"])


COMPLIANCE_TOOLS = [assess_framework_compliance, get_regulatory_deadline, identify_compliance_gaps]


def should_continue(state: ComplianceState) -> str:
    last = state["messages"][-1]
    return "tools" if (hasattr(last, "tool_calls") and last.tool_calls) else "end"


def call_model(state: ComplianceState) -> dict:
    model = get_chat_model()
    if model is None:
        return {"messages": state["messages"] + [AIMessage(content="AI not configured.")]}
    bound = model.bind_tools(COMPLIANCE_TOOLS)
    response = bound.invoke(state["messages"])
    return {"messages": state["messages"] + [response]}


def build_compliance_graph():
    workflow = StateGraph(ComplianceState)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", ToolNode(COMPLIANCE_TOOLS))
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
    workflow.add_edge("tools", "agent")
    return workflow.compile()


async def run_compliance_agent(context: dict, objective: str) -> dict:
    settings = get_settings()

    if not settings.has_api_key:
        return {
            "steps": [],
            "final_output": f"""## Compliance Assessment (Fallback Mode)

**Objective:** {objective}

**Framework Coverage:**
- NIST CSF 2.0: 72% compliant — gaps in DE (Detect) and GV (Govern)
- ISO 27001:2022: 78% compliant — A.8 technological controls partially evidenced
- DORA: 69% compliant — Third-party ICT risk management programme incomplete
- EU AI Act: 45% compliant — High-risk AI inventory and conformity assessments outstanding

**Priority Gaps:**
1. AI Governance framework documentation (EU AI Act Art. 9)
2. Third-party incident reporting procedures (DORA Art. 19)
3. Continuous monitoring evidence for access controls (NIST CSF DE.CM)

**Recommended Actions:**
- Commission EU AI Act gap assessment (Q3 2026)
- Update TPICM programme to meet DORA requirements (immediate)
- Implement automated evidence collection for NIST CSF controls""",
            "recommendations": [
                "Complete EU AI Act high-risk system inventory",
                "Remediate DORA TPICM programme gaps",
                "Implement automated compliance evidence collection",
            ],
        }

    ctx_str = "\n".join(f"- {k}: {v}" for k, v in context.items())
    prompt = f"""You are a regulatory compliance expert for financial services.
Use the tools to:
1. Assess compliance across relevant frameworks (NIST_CSF, ISO_27001, DORA)
2. Get regulatory deadlines
3. Identify gaps below 85% target

Context:
{ctx_str}

Objective: {objective}

Be systematic: check each framework, identify gaps, then provide a prioritised action plan."""

    graph = build_compliance_graph()
    result = await graph.ainvoke({
        "messages": [HumanMessage(content=prompt)],
        "frameworks_checked": [],
        "gaps": [],
        "overall_score": 0.0,
    })

    steps = []
    final = ""
    recs = []
    for msg in result["messages"]:
        if isinstance(msg, ToolMessage):
            steps.append({"tool": getattr(msg, "name", "tool"), "output": str(msg.content)[:300]})
        elif isinstance(msg, AIMessage) and not (hasattr(msg, "tool_calls") and msg.tool_calls):
            final = msg.content

    if final:
        for line in final.split("\n"):
            stripped = line.strip()
            if stripped.startswith(("- ", "* ", "1.", "2.", "3.", "4.", "5.")):
                recs.append(stripped.lstrip("-* 12345.").strip())

    return {"steps": steps, "final_output": final or "Compliance analysis complete.", "recommendations": recs[:6]}
