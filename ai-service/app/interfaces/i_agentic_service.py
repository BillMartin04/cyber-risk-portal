from abc import ABC, abstractmethod
from app.models.schemas import ApprovalQueueItem, AgentActionSuggestion


class IAgenticService(ABC):
    """Contract for human-in-the-loop agentic action management."""

    @abstractmethod
    def propose_action(self, suggestion: AgentActionSuggestion, context: dict) -> ApprovalQueueItem:
        """Add an agentic action to the approval queue."""
        ...

    @abstractmethod
    def get_queue(self) -> list[ApprovalQueueItem]:
        """Return all items in the approval queue."""
        ...

    @abstractmethod
    def approve(self, item_id: str, approved_by: str) -> ApprovalQueueItem:
        """Approve a pending action."""
        ...

    @abstractmethod
    def reject(self, item_id: str, reason: str) -> ApprovalQueueItem:
        """Reject a pending action."""
        ...

    @abstractmethod
    async def execute(self, item_id: str) -> ApprovalQueueItem:
        """Execute an approved action."""
        ...
