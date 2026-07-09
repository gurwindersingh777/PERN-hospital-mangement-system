import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { UNAUTHORIZED } from "../constants/statusCode.js";
import { verifyAccessToken } from "../modules/auth/auth.helper.js";
import { authRepository } from "../modules/auth/auth.repository.js";


export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(UNAUTHORIZED, "Authentication required")
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw new ApiError(UNAUTHORIZED, "Access token missing");
    }

    const payload = verifyAccessToken(accessToken)

    const user = await authRepository.findUserById(payload.userId)

    if (!user) {
      throw new ApiError(UNAUTHORIZED, "Invalid refresh token");
    }

    if (!user.isActive) {
      throw new ApiError(UNAUTHORIZED, "Account is inactive");
    }

    req.user = {
      userId: user.id,
      role: user.role
    }

    next()
  } catch (error) {
    next(error)
  }
}