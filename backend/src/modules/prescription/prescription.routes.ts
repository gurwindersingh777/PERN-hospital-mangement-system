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
import { authorizeOwnership } from "../../middlewares/authorizeOwnership.middleware.js";
import { OwnershipResource } from "../../ownership/ownership.types.js";

const prescriptionRouter = Router();

prescriptionRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  validate(getPrescriptionSchema),
  prescriptionController.findAll
);
prescriptionRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authorizeOwnership({
    resource: OwnershipResource.PRESCRIPTION,
    getResourceId: (req) => req.params.id as string,
  }),
  prescriptionController.findById
);
prescriptionRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR),
  validate(prescriptionSchema),
  prescriptionController.create
);
prescriptionRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR),
  authorizeOwnership({
    resource: OwnershipResource.PRESCRIPTION,
    getResourceId: (req) => req.params.id as string,
  }),
  validate(updatePrescriptionSchema),
  prescriptionController.update
);

export default prescriptionRouter;
