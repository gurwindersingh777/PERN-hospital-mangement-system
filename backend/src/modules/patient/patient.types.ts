import { Prisma } from "@prisma/client";

export type PatientWithRelations = Prisma.PatientGetPayload<{
  include: {
    user: true;
  };
}>;
