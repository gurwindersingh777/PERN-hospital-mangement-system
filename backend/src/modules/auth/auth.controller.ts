import { Request, Response } from "express";
import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { setAuthCookies } from "./auth.helper.js";
import { authService } from "./auth.service.js";

export const authController = {

  registerUser: (AsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setAuthCookies(res, result.refreshToken)
    
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
  })),

  loginUser: (AsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    setAuthCookies(res, result.refreshToken)

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
  }))

}