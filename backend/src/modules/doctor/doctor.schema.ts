import z from "zod";

export const doctorSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    departmentId: z.string().uuid(),
    phoneNumber: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number").optional(),
    qualification: z.string().min(2).max(100).optional(),
    specialty: z.string().min(2).max(100),
    experienceYears: z.number().int().min(0).max(60).optional(),
    workingHours: z.string().min(2).max(100),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    userId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9][\d]{0,15}$/)
      .optional(),
    qualification: z.string().min(2).max(100).optional(),
    specialty: z.string().min(2).max(100).optional(),
    experienceYears: z.number().int().min(0).max(60).optional(),
    workingHours: z.string().min(2).max(100).optional(),
  }),
});

export const getDoctorsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type DoctorInput = z.infer<typeof doctorSchema>["body"];
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>["body"];
export type GetDoctorInput = z.infer<typeof getDoctorsSchema>["query"];
