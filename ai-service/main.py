import uvicorn
from app.api import create_app
from app.core.config import get_settings

app = create_app()

if __name__ == "__main__":
    settings = get_settings()
    status = "LIVE (Claude API)" if settings.has_api_key else "FALLBACK — add ANTHROPIC_API_KEY to .env to enable"
    print(f"\n  Python AI Service  (FastAPI + LangGraph)")
    print(f"  Port  : {settings.ai_service_port}")
    print(f"  AI    : {status}")
    print(f"  Docs  : http://localhost:{settings.ai_service_port}/docs")
    print(f"  Stack : Anthropic SDK | LangChain | LangGraph | FastAPI\n")
    uvicorn.run(
        "main:app",
        host=settings.ai_service_host,
        port=settings.ai_service_port,
        reload=True,
    )
