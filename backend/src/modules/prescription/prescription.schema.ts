import z from "zod";

export const prescriptionSchema = z.object({
  body: z
    .object({
      medicalRecordId: z.string().trim().uuid(),
      medicineName: z.string().trim(),
      dosage: z.string().trim(),
      duration: z.string().trim(),
      instructions: z.string().trim().optional(),
    })
    .strict(),
});

export const updatePrescriptionSchema = z.object({
  body: z
    .object({
      medicineName: z.string().trim().optional(),
      dosage: z.string().trim().optional(),
      duration: z.string().trim().optional(),
      instructions: z.string().trim().optional(),
    })
    .strict(),
});

export const getPrescriptionSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type PrescriptionInput = z.infer<typeof prescriptionSchema>["body"];
export type UpdatePrescriptionInput = z.infer<
  typeof updatePrescriptionSchema
>["body"];
export type GetPrescriptionInput = z.infer<
  typeof getPrescriptionSchema
>["query"];
