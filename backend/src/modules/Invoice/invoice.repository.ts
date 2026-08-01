import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

const invoiceInclude = {
  appointment: {
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
      patient: {
        include: {
          user: true,
        },
      },
    },
  },
} satisfies Prisma.InvoiceInclude;

export const invoiceRepository = {
  create(data: Prisma.InvoiceUncheckedCreateInput) {
    return prisma.invoice.create({
      data,
      include: invoiceInclude,
    });
  },

  findById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: invoiceInclude,
    });
  },

  findAll(skip: number, take: number, where?: Prisma.InvoiceWhereInput) {
    return prisma.invoice.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: "desc" },
      include: invoiceInclude,
    });
  },

  update(id: string, data: Prisma.InvoiceUpdateInput) {
    return prisma.invoice.update({
      where: { id },
      data,
      include: invoiceInclude,
    });
  },

  count(where?: Prisma.InvoiceWhereInput) {
    return prisma.invoice.count({ where });
  },

  findAppointmentById(id: string) {
    return prisma.appointment.findUnique({ where: { id } });
  },

  findByAppointmentId(id: string) {
    return prisma.invoice.findUnique({ where: { appointmentId: id } });
  },
};
