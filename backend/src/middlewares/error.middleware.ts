import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { REFRESH_PATH } from "../constants/refreshPath.js";
import { ApiError } from "../utils/ApiError.js";
import z from "zod";
import { logger } from "../config/logger.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusCode.js";

export const ErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");

  if (req.path === REFRESH_PATH) {
    // clear cookies
  }

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    return res.status(BAD_REQUEST).json({ success: false, errors });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Internal Server Error" });
};
