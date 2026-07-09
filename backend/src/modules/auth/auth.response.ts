import { User } from "@prisma/client";

export const toUserResponse = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};