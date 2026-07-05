import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?:       string;
}

export function errorHandler(
  err:  AppError,
  _req: Request,
  res:  Response,
  _next: NextFunction,
): void {
  const status  = err.statusCode ?? 500;
  const message = err.message    ?? 'Internal Server Error';
  res.status(status).json({ success: false, error: { code: err.code ?? 'INTERNAL_ERROR', message } });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } });
}

export function createError(message: string, statusCode = 400, code = 'BAD_REQUEST'): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.code       = code;
  return err;
}
