import { Prisma } from "@prisma/client";

export type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    appointment: {
      include: {
        doctor: {
          include: {
            user: true;
          };
        };
        patient: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;
