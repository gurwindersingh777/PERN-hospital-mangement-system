import { Prisma } from "@prisma/client";

export type PrescriptionWithRelations = Prisma.PrescriptionGetPayload<{
  include: {
    medicalRecord: true;
  };
}>;
