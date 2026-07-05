from datetime import datetime
from fastapi import HTTPException
from app.interfaces.i_agentic_service import IAgenticService
from app.models.schemas import ApprovalQueueItem, AgentActionSuggestion


class AgenticServiceImpl(IAgenticService):
    """
    Human-in-the-loop approval queue for agentic actions.
    SRP: manages the lifecycle of proposed agentic actions only.
    No AI logic lives here — that belongs in agents/.
    """

    def __init__(self) -> None:
        self._queue: dict[str, ApprovalQueueItem] = {}
        self._seed_demo_items()

    def propose_action(self, suggestion: AgentActionSuggestion, context: dict) -> ApprovalQueueItem:
        item = ApprovalQueueItem(
            proposed_action=suggestion.action,
            description=suggestion.description,
            impact=suggestion.impact,
            risk_level=suggestion.risk_level,
            tier=suggestion.tier,
            context=context,
        )
        self._queue[item.id] = item
        return item

    def get_queue(self) -> list[ApprovalQueueItem]:
        return sorted(self._queue.values(), key=lambda x: x.created_at, reverse=True)

    def approve(self, item_id: str, approved_by: str = "system") -> ApprovalQueueItem:
        item = self._get_or_raise(item_id)
        if item.status != "pending":
            raise HTTPException(status_code=400, detail=f"Item is already {item.status}")
        item.status = "approved"
        item.resolved_by = approved_by
        item.resolved_at = datetime.utcnow().isoformat()
        return item

    def reject(self, item_id: str, reason: str = "") -> ApprovalQueueItem:
        item = self._get_or_raise(item_id)
        if item.status != "pending":
            raise HTTPException(status_code=400, detail=f"Item is already {item.status}")
        item.status = "rejected"
        item.resolved_at = datetime.utcnow().isoformat()
        item.result = reason or "Rejected by reviewer"
        return item

    async def execute(self, item_id: str) -> ApprovalQueueItem:
        item = self._get_or_raise(item_id)
        if item.status != "approved":
            raise HTTPException(status_code=400, detail="Only approved actions can be executed")
        item.status = "executed"
        item.result = f"Action '{item.proposed_action}' executed successfully at {datetime.utcnow().isoformat()}"
        return item

    def _get_or_raise(self, item_id: str) -> ApprovalQueueItem:
        item = self._queue.get(item_id)
        if not item:
            raise HTTPException(status_code=404, detail=f"Approval item '{item_id}' not found")
        return item

    def _seed_demo_items(self) -> None:
        demos = [
            ApprovalQueueItem(
                proposed_action="schedule-attestation",
                description="Schedule quarterly control attestation for PAM domain",
                impact="Attestation requests dispatched to 4 control owners",
                risk_level="medium",
                tier="executor",
                context={"domain": "Access Management", "controls": 4},
            ),
            ApprovalQueueItem(
                proposed_action="create-workflow",
                description="Initiate governance workflow for Shadow AI risk issue",
                impact="Creates tracked remediation workflow with CISO approval stage",
                risk_level="high",
                tier="analyst",
                context={"risk": "Shadow AI", "priority": "P1"},
            ),
        ]
        for d in demos:
            self._queue[d.id] = d


agentic_service: IAgenticService = AgenticServiceImpl()
