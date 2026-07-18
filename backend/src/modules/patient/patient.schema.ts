import { BloodGroup, Gender } from "@prisma/client";
import z from "zod";

export const patientSchema = z.object({
  body: z.object({
    userId: z.string().trim().uuid(),
    dateOfBirth: z.coerce.date(),
    gender: z.nativeEnum(Gender).optional(),
    bloodGroup: z.nativeEnum(BloodGroup).optional(),
    contactNumber: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number").optional(),
    address: z.string().trim().min(2).max(255).optional(),
    emergencyContact: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number").optional(),
  }).strict()
})

export const updatePatientSchema = z.object({
  body: z.object({
    userId: z.string().trim().uuid().optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.nativeEnum(Gender).optional(),
    bloodGroup: z.nativeEnum(BloodGroup).optional(),
    contactNumber: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number").optional(),
    address: z.string().trim().min(2).max(255).optional(),
    emergencyContact: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number").optional(),
  }).strict()
})

export const getPatientsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type PatientInput = z.infer<typeof patientSchema>["body"];
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>["body"];
export type GetPatientsInput = z.infer<typeof getPatientsSchema>["query"];