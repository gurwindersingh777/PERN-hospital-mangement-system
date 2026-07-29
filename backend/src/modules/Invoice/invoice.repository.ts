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

  findAll(skip: number, take: number) {
    return prisma.invoice.findMany({
      skip,
      take,
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

  count() {
    return prisma.invoice.count();
  },

  findAppointmentById(id: string) {
    return prisma.appointment.findUnique({ where: { id } });
  },

  findByAppointmentId(id: string) {
    return prisma.invoice.findUnique({ where: { appointmentId: id } });
  },
};
