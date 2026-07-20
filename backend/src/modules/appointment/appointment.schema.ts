import { AppointmentStatus } from "@prisma/client";
import z from "zod";

export const appointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().trim().uuid(),
    patientId: z.string().trim().uuid(),
    slotStart: z.coerce.date(),
    reason: z.string().trim().min(2).max(500).optional(),
  }).strict(),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    slotStart: z.coerce.date().optional(),
    reason: z.string().trim().min(2).max(500).optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
  }).strict(),
});

export const getAppointmentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>["body"];
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>["body"];
export type GetAppointmentsInput = z.infer<typeof getAppointmentsSchema>["query"];