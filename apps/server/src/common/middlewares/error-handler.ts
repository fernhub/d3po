import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { HttpError } from "shared/exceptions/HttpError";
import { HttpStatus } from "shared/enums/http-status.enums";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  console.log("in error handler");
  if (err instanceof z.ZodError) {
    console.log(err.flatten());
    res.status(HttpStatus.BAD_REQUEST).json({
      error: err.flatten(),
    });
    return;
  } else if (err instanceof HttpError) {
    console.log(err.code);
    const error = err as Error & { statusCode?: number };
    res.status(error.statusCode ?? 400).json({
      message: err.message,
    });
    return;
  } else {
    console.log(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: `Unknown error occured`,
    });
  }
}
