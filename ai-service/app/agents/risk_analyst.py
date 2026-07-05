"""
LangGraph Risk Analyst Agent.
Uses a ReAct loop with domain-specific tools to perform multi-step risk analysis.
"""
from typing import TypedDict, Annotated
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from app.core.client import get_chat_model
from app.core.config import get_settings


# ── Agent state ───────────────────────────────────────────────────────────────

class RiskAnalystState(TypedDict):
    messages: list
    risk_context: dict
    steps_taken: list[str]
    final_analysis: str
    recommendations: list[str]


# ── Tools ─────────────────────────────────────────────────────────────────────

@tool
def get_framework_control(framework: str, domain: str) -> str:
    """Get specific control requirements from NIST CSF 2.0, ISO 27001, GDPR, or DORA."""
    db = {
        ("NIST CSF 2.0", "access"): "PR.AA-01: Identities and credentials are managed. PR.AA-02: Identities are proofed. PR.AA-05: Access permissions are managed.",
        ("NIST CSF 2.0", "detect"): "DE.CM-01: Networks are monitored. DE.CM-06: External service provider activities are monitored. DE.AE-02: Potentially adverse events are analyzed.",
        ("ISO 27001", "access"): "A.9.1 Business requirements of access control. A.9.2 User access management. A.9.4 System and application access control.",
        ("GDPR", "security"): "Art. 32: Appropriate technical and organisational measures including pseudonymisation, encryption, confidentiality, integrity, availability and resilience.",
        ("DORA", "ict"): "Art. 9: ICT Security Policies. Art. 10: ICT Risk Management Framework. Art. 19: Reporting of major ICT-related incidents.",
    }
    key = (framework, domain.lower())
    return db.get(key, f"Refer to {framework} official documentation for {domain} controls.")


@tool
def calculate_risk_score(likelihood: int, impact: int, control_effectiveness: float) -> dict:
    """
    Calculate inherent and residual risk scores.
    likelihood: 1-5, impact: 1-5, control_effectiveness: 0.0-1.0
    """
    inherent = likelihood * impact
    residual = round(inherent * (1 - control_effectiveness), 2)
    rating = "Critical" if residual >= 20 else "High" if residual >= 15 else "Medium" if residual >= 8 else "Low"
    return {
        "inherent_risk": inherent,
        "inherent_max": 25,
        "control_effectiveness_pct": round(control_effectiveness * 100),
        "residual_risk": residual,
        "residual_max": 25,
        "rating": rating,
    }


@tool
def get_threat_intelligence(domain: str) -> str:
    """Retrieve current threat intelligence relevant to the risk domain."""
    intel = {
        "access": "NCSC Alert AA24-242A: Threat actors actively exploiting weak MFA implementations. Credential stuffing attacks up 34% YoY.",
        "data": "ICO enforcement action Q1 2026: 12 fines issued for inadequate data retention controls. Average fine: £420K.",
        "ai": "OWASP LLM Top 10 2025: Prompt injection and model supply chain attacks are the #1 and #2 vectors. Shadow AI adoption increasing 60% YoY in financial services.",
        "third-party": "DORA compliance deadline passed — 23% of firms still have incomplete TPICM programmes. Regulatory scrutiny intensifying.",
        "resilience": "FCA Dear CEO letter Feb 2026: Operational resilience important milestones must be met. Impact tolerance testing required.",
    }
    return intel.get(domain.lower(), f"No specific threat intelligence available for '{domain}'. Refer to NCSC and sector-specific threat reports.")


TOOLS = [get_framework_control, calculate_risk_score, get_threat_intelligence]


# ── Graph nodes ───────────────────────────────────────────────────────────────

def should_continue(state: RiskAnalystState) -> str:
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return "end"


def call_model(state: RiskAnalystState) -> dict:
    model = get_chat_model()
    if model is None:
        return {
            "messages": state["messages"] + [
                AIMessage(content="AI not configured. Set ANTHROPIC_API_KEY to enable agent analysis.")
            ]
        }
    bound = model.bind_tools(TOOLS)
    response = bound.invoke(state["messages"])
    return {"messages": state["messages"] + [response]}


# ── Graph builder ─────────────────────────────────────────────────────────────

def build_risk_analyst_graph():
    workflow = StateGraph(RiskAnalystState)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", ToolNode(TOOLS))
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
    workflow.add_edge("tools", "agent")
    return workflow.compile()


# ── Public run function ───────────────────────────────────────────────────────

async def run_risk_analyst(context: dict, objective: str) -> dict:
    settings = get_settings()

    if not settings.has_api_key:
        return {
            "steps": [{"step": "Analysis", "detail": "Fallback mode — API key not configured"}],
            "final_output": f"""## Risk Analyst Report (Fallback Mode)

**Objective:** {objective}

**Analysis:**
Based on the provided context, this risk domain requires focused attention across three dimensions:
1. Control coverage adequacy against NIST CSF 2.0 framework requirements
2. Residual risk alignment with board-approved risk appetite
3. Threat landscape currency — ensure controls address current NCSC advisories

**Recommendations:**
- Conduct quarterly control effectiveness review
- Validate likelihood/impact assumptions against latest threat intelligence
- Prioritise remediation of access management and monitoring gaps

*Enable live AI for deep multi-step agent analysis with tool calling.*""",
            "recommendations": [
                "Review control effectiveness against NIST CSF 2.0",
                "Validate risk scoring with current threat intelligence",
                "Escalate residual risks above appetite threshold",
            ],
        }

    ctx_str = "\n".join(f"- {k}: {v}" for k, v in context.items())
    system_msg = f"""You are a senior cyber risk analyst. Use the available tools to:
1. Look up relevant framework controls
2. Calculate risk scores
3. Retrieve threat intelligence
4. Synthesise a comprehensive analysis with concrete recommendations.

Risk Context:
{ctx_str}

Be methodical: use tools first, then synthesise."""

    graph = build_risk_analyst_graph()
    result = await graph.ainvoke({
        "messages": [HumanMessage(content=f"{system_msg}\n\nObjective: {objective}")],
        "risk_context": context,
        "steps_taken": [],
        "final_analysis": "",
        "recommendations": [],
    })

    steps = []
    recs = []
    final = ""
    for msg in result["messages"]:
        if isinstance(msg, ToolMessage):
            steps.append({"tool": msg.name if hasattr(msg, "name") else "tool", "output": msg.content[:200]})
        elif isinstance(msg, AIMessage) and not (hasattr(msg, "tool_calls") and msg.tool_calls):
            final = msg.content

    if final:
        for line in final.split("\n"):
            if line.strip().startswith(("- ", "* ", "1.", "2.", "3.")):
                recs.append(line.strip().lstrip("-* 123456789.").strip())

    return {"steps": steps, "final_output": final or "Analysis complete.", "recommendations": recs[:5]}
