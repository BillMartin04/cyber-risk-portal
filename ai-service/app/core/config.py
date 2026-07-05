import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    # Railway injects $PORT — fall back to 8000 locally
    ai_service_port: int = int(os.environ.get("PORT", 8000))
    ai_service_host: str = "0.0.0.0"
    cors_origins: str = "http://localhost:5173,http://192.168.1.46:5173"
    log_level: str = "INFO"
    model_id: str = "claude-sonnet-4-6"

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def has_api_key(self) -> bool:
        return bool(self.anthropic_api_key and self.anthropic_api_key.startswith("sk-ant"))

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
