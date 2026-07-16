import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import {
  doctorSchema,
  getDoctorsSchema,
  updateDoctorSchema,
} from "./doctor.schema.js";
import { doctorController } from "./doctor.controller.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";

const doctorRouter = Router();

doctorRouter.get("/", validate(getDoctorsSchema), doctorController.findAll);
doctorRouter.get("/:id", doctorController.findById);
doctorRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(doctorSchema),
  doctorController.create
);
doctorRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  validate(updateDoctorSchema),
  doctorController.update
);

export default doctorRouter;
