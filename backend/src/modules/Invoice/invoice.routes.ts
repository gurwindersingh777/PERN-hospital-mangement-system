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

const InvoiceRouter = Router();

InvoiceRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(getInvoiceSchema),
  invoiceController.findAll
);
InvoiceRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  invoiceController.findById
);
InvoiceRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(invoiceSchema),
  invoiceController.create
);
InvoiceRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  validate(updateInvoiceSchema),
  invoiceController.update
);

export default InvoiceRouter;
