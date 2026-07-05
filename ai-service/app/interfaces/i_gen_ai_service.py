from abc import ABC, abstractmethod
from app.models.schemas import AIAssistRequest, AIAssistResponse


class IGenAIService(ABC):
    """Contract for all GenAI generation capabilities. OCP: extend by subclass, not modification."""

    @abstractmethod
    async def assist(self, request: AIAssistRequest) -> AIAssistResponse:
        """Generate a response to an AI assist request."""
        ...

    @abstractmethod
    def is_live(self) -> bool:
        """Returns True if connected to real Claude API, False if using fallback."""
        ...
