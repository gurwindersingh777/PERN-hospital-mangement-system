import { InvoiceStatus } from "@prisma/client";
import z from "zod";

export const invoiceSchema = z.object({
  body: z
    .object({
      appointmentId: z.string().uuid(),
      amount: z.coerce.number().positive(),
      paymentMethod: z.string().min(2).max(100).optional(),
    })
    .strict(),
});

export const updateInvoiceSchema = z.object({
  body: z
    .object({
      status: z.nativeEnum(InvoiceStatus),
      paymentMethod: z.string().min(2).max(100).optional(),
      paidAt: z.coerce.date().optional(),
    })
    .strict(),
});

export const getInvoiceSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>["body"];
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>["body"];
export type GetInvoiceInput = z.infer<typeof getInvoiceSchema>["query"];
