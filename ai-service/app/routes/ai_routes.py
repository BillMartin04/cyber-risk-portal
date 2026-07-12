from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    AIAssistRequest, AIAssistResponse, AIStatusResponse,
    ApprovalQueueItem, ApprovalActionRequest,
)
from app.services.gen_ai_service import gen_ai_service
from app.services.agentic_service import agentic_service
from app.core.config import get_settings

router = APIRouter(prefix="/ai-api", tags=["AI"])


@router.get("/status", response_model=AIStatusResponse)
def get_status():
    settings = get_settings()
    return AIStatusResponse(
        status="operational",
        ai_enabled=settings.has_api_key,
        model=settings.model_id if settings.has_api_key else "fallback-mode",
    )


@router.post("/assist", response_model=AIAssistResponse)
async def assist(request: AIAssistRequest):
    return await gen_ai_service.assist(request)


@router.get("/approval-queue", response_model=list[ApprovalQueueItem])
def get_approval_queue():
    return agentic_service.get_queue()


@router.post("/approval-queue/{item_id}/approve", response_model=ApprovalQueueItem)
def approve_action(item_id: str, body: ApprovalActionRequest = ApprovalActionRequest()):
    return agentic_service.approve(item_id, approved_by=body.reason or "reviewer")


@router.post("/approval-queue/{item_id}/reject", response_model=ApprovalQueueItem)
def reject_action(item_id: str, body: ApprovalActionRequest = ApprovalActionRequest()):
    return agentic_service.reject(item_id, reason=body.reason or "")


@router.post("/approval-queue/{item_id}/execute", response_model=ApprovalQueueItem)
async def execute_action(item_id: str):
    return await agentic_service.execute(item_id)


@router.post("/approval-queue/{item_id}/reset", response_model=ApprovalQueueItem)
def reset_action(item_id: str):
    return agentic_service.reset_to_pending(item_id)
