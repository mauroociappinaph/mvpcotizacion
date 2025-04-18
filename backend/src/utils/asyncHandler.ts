import { Request, Response, NextFunction } from 'express';

// Wraps async route handlers to catch errors and pass them to Express error handler
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
