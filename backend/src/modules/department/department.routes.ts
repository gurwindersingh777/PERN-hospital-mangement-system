import { Router } from "express";
import { departmentController } from "./department.controller.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  departmentSchema,
  updateDepartmentSchema,
} from "./department.schema.js";

const departmentRouter = Router();

departmentRouter.post(
  "/",
  validate(departmentSchema),
  authorizeRole(UserRole.ADMIN),
  departmentController.create
);
departmentRouter.get("/", departmentController.findAll);
departmentRouter.get("/:id", departmentController.findById);
departmentRouter.patch(
  "/:id",
  validate(updateDepartmentSchema),
  authorizeRole(UserRole.ADMIN),
  departmentController.update
);

export default departmentRouter;
