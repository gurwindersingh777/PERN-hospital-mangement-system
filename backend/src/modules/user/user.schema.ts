import { UserRole } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(32),
    role: z.nativeEnum(UserRole),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100).optional(),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const userParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type GetUsersQuery = z.infer<typeof getUsersSchema>["query"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
