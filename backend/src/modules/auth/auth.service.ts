import { UserRole } from "@prisma/client";
import { CONFLICT, UNAUTHORIZED } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from "./auth.helper.js";

import { LoginInput, RegisterInput } from "./auth.schema.js";
import { authRepository } from "./auth.repository.js";
import { toUserResponse } from "./auth.response.js";


export const authService = {

  async register(data: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(CONFLICT, "Email already registered")
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: UserRole.PATIENT
    })

    const payload = {
      userId: user.id,
      role: user.role
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  },

  async login(data: LoginInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(UNAUTHORIZED, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(UNAUTHORIZED, "Invalid email or password");
    }

    const payload = {
      userId: user.id,
      role: user.role
    }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

}