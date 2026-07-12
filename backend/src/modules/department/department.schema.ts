import z from "zod";

export const departmentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" })
      .trim(),
    description: z
      .string()
      .trim()
      .max(200, { message: "Description must be at most 200 characters long" })
      .optional()
  })
})

export const updateDepartmentSchema = z.object({
  body: departmentSchema.shape.body.partial(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>["body"];
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>["body"];