import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { REFRESH_PATH } from "../constants/refreshPath.js";
import { ApiError } from "../utils/ApiError.js";
import z from "zod";
import { logger } from "../config/logger.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusCode.js";
import { clearAuthCookies } from "../modules/auth/auth.helper.js";

export const ErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }


  if (err instanceof z.ZodError) {
    logger.warn({
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      errors: err.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    }, "Validation failed");

    return res.status(BAD_REQUEST).json({
      success: false,
      errors: err.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof ApiError) {

    if (err.statusCode >= 500) {
      logger.error({
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        message: err.message,
      }, "Server error");
    } else {
      logger.warn({
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        message: err.message,
      }, "Request failed");
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  logger.error({
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    err,
  }, "Unhandled server error");

  return res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
  });
};
