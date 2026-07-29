import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";
import {
  getPrescriptionSchema,
  prescriptionSchema,
  updatePrescriptionSchema,
} from "./prescription.schema.js";
import { prescriptionController } from "./prescription.controller.js";

const prescriptionRouter = Router();

prescriptionRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(getPrescriptionSchema),
  prescriptionController.findAll
);
prescriptionRouter.get("/:id", prescriptionController.findById);
prescriptionRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(prescriptionSchema),
  prescriptionController.create
);
prescriptionRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  validate(updatePrescriptionSchema),
  prescriptionController.update
);

export default prescriptionRouter;
