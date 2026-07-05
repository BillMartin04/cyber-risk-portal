// In dev: empty string → Vite proxy handles /api/* and /ai-api/*
// In production: set VITE_API_BASE and VITE_AI_API_BASE in Vercel env vars
export const API_BASE    = import.meta.env.VITE_API_BASE    ?? '';
export const AI_API_BASE = import.meta.env.VITE_AI_API_BASE ?? '';
