import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/statusCode.js";

export const authorizeRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(UNAUTHORIZED, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(FORBIDDEN, "Access denied");
    }

    next();
  };
};
