import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";
import {
  getInvoiceSchema,
  invoiceSchema,
  updateInvoiceSchema,
} from "./invoice.schema.js";
import { invoiceController } from "./invoice.controller.js";
import { OwnershipResource } from "../../ownership/ownership.types.js";
import { authorizeOwnership } from "../../middlewares/authorizeOwnership.middleware.js";

const InvoiceRouter = Router();

InvoiceRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
  validate(getInvoiceSchema),
  invoiceController.findAll
);
InvoiceRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
  authorizeOwnership({
    resource: OwnershipResource.INVOICE,
    getResourceId: (req) => req.params.id as string,
  }),
  invoiceController.findById
);
InvoiceRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  validate(invoiceSchema),
  invoiceController.create
);
InvoiceRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
  validate(updateInvoiceSchema),
  authorizeOwnership({
    resource: OwnershipResource.INVOICE,
    getResourceId: (req) => req.params.id as string,
  }),
  invoiceController.update
);

export default InvoiceRouter;
