import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { env } from "../../config/env.config.js"
import bcrypt from "bcrypt"
import { JwtPayloadType } from "./auth.type.js"
import { CookieOptions, Response } from "express"
import { REFRESH_PATH } from "../../constants/refreshPath.js"


export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, Number(env.SALT_ROUNDS))
}

export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateAccessToken(payload: JwtPayloadType) {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"]
  })
}

export function generateRefreshToken(payload: JwtPayloadType) {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"]
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayloadType
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayloadType
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: REFRESH_PATH
};

export const setAuthCookies = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, cookieOptions);
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", cookieOptions);
};
