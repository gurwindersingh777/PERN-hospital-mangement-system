import z from "zod";

export const medicalRecordSchema = z.object({
  body: z
    .object({
      appointmentId: z.string().uuid(),
      diagnosis: z.string().min(1),
      notes: z.string().min(2).max(500).optional(),
    })
    .strict(),
});

export const updateMedicalRecordSchema = z.object({
  body: z
    .object({
      diagnosis: z.string().min(1).optional(),
      notes: z.string().min(2).max(500).optional(),
    })
    .strict(),
});

export const getMedicalRecordSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>["body"];
export type UpdateMedicalRecordInput = z.infer<
  typeof updateMedicalRecordSchema
>["body"];
export type GetMedicalRecordInput = z.infer<
  typeof getMedicalRecordSchema
>["query"];
