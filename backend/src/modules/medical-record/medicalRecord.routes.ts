import { Router } from "express";
import {
  getMedicalRecordSchema,
  medicalRecordSchema,
  updateMedicalRecordSchema,
} from "./medicalRecord.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";
import { medicalRecordController } from "./medicalRecord.controller.js";
import { authorizeOwnership } from "../../middlewares/authorizeOwnership.middleware.js";
import { OwnershipResource } from "../../ownership/ownership.types.js";

const medicalRecordRouter = Router();

medicalRecordRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  validate(getMedicalRecordSchema),
  medicalRecordController.findAll
);

medicalRecordRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authorizeOwnership({
    resource: OwnershipResource.MEDICAL_RECORD,
    getResourceId: (req) => req.params.id as string,
  }),
  medicalRecordController.findById
);

medicalRecordRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR),
  validate(medicalRecordSchema),
  medicalRecordController.create
);

medicalRecordRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR),
  authorizeOwnership({
    resource: OwnershipResource.MEDICAL_RECORD,
    getResourceId: (req) => req.params.id as string,
  }),
  validate(updateMedicalRecordSchema),
  medicalRecordController.update
);

export default medicalRecordRouter;
