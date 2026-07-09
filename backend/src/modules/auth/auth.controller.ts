import { Request, Response } from "express";
import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { clearAuthCookies, setAuthCookies } from "./auth.helper.js";
import { authService } from "./auth.service.js";

export const authController = {
  registerUser: AsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setAuthCookies(res, result.refreshToken);

    return res.status(CREATED).json(
      new ApiResponse(
        CREATED,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        "Registration successful"
      )
    );
  }),

  loginUser: AsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    setAuthCookies(res, result.refreshToken);

    return res.status(OK).json(
      new ApiResponse(
        OK,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        "Login successful"
      )
    );
  }),

  refresh: AsyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await authService.refresh(refreshToken);

    return res
      .status(OK)
      .json(
        new ApiResponse(OK, { accessToken }, "Token refreshed successfully")
      );
  }),

  logoutUser: AsyncHandler(async (_req: Request, res: Response) => {
    clearAuthCookies(res);

    return res
      .status(OK)
      .json(new ApiResponse(OK, null, "Logout successfully"));
  }),

  getCurrentUser: AsyncHandler(async (req: Request, res: Response) => {
    const user = await authService.currentUser(req.user!.userId);

    return res
      .status(OK)
      .json(new ApiResponse(OK, user, "User profile fetched successfully"));
  }),
};
