from anthropic import Anthropic
from langchain_anthropic import ChatAnthropic
from functools import lru_cache
from .config import get_settings


@lru_cache()
def get_anthropic_client() -> Anthropic | None:
    settings = get_settings()
    if not settings.has_api_key:
        return None
    return Anthropic(api_key=settings.anthropic_api_key)


@lru_cache()
def get_chat_model() -> ChatAnthropic | None:
    settings = get_settings()
    if not settings.has_api_key:
        return None
    return ChatAnthropic(
        model=settings.model_id,
        api_key=settings.anthropic_api_key,
        temperature=0.3,
        max_tokens=2048,
    )
