from fastapi import APIRouter
from app.models.schemas import AgentRunRequest, AgentRunResponse
from app.agents.risk_analyst import run_risk_analyst
from app.agents.compliance_agent import run_compliance_agent
from datetime import datetime

router = APIRouter(prefix="/ai-api/agents", tags=["Agents"])


@router.post("/risk-analyst", response_model=AgentRunResponse)
async def run_risk_analyst_agent(request: AgentRunRequest):
    result = await run_risk_analyst(request.context, request.objective)
    return AgentRunResponse(
        agent_type="risk-analyst",
        objective=request.objective,
        steps=result.get("steps", []),
        final_output=result.get("final_output", ""),
        recommendations=result.get("recommendations", []),
    )


@router.post("/compliance", response_model=AgentRunResponse)
async def run_compliance_agent_endpoint(request: AgentRunRequest):
    result = await run_compliance_agent(request.context, request.objective)
    return AgentRunResponse(
        agent_type="compliance",
        objective=request.objective,
        steps=result.get("steps", []),
        final_output=result.get("final_output", ""),
        recommendations=result.get("recommendations", []),
    )
