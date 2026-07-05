from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.routes.ai_routes import router as ai_router
from app.routes.agent_routes import router as agent_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Cyber Risk Portal — Python AI Service",
        description="LangGraph-powered agentic AI microservice for cyber risk analysis",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(ai_router)
    app.include_router(agent_router)

    @app.get("/health")
    def health():
        return {
            "status": "ok",
            "service": "Python AI Service",
            "ai_enabled": settings.has_api_key,
        }

    return app
