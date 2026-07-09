import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);
authRouter.post("/login", validate(loginSchema), authController.loginUser);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logoutUser);
authRouter.get("/me", authenticate, authController.getCurrentUser);

export default authRouter;
