import { UserRole } from "@prisma/client";

export interface JwtPayloadType {
  userId: string;
  role: UserRole;
}
