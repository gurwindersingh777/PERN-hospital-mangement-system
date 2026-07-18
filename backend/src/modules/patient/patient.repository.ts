import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const patientRepository = {

  create(data: Prisma.PatientUncheckedCreateInput) {
    return prisma.patient.create({ data, include: { user: true } });
  },

  findById(id: string) {
    return prisma.patient.findUnique({ where: { id }, include: { user: true } })
  },

  findAll(skip: number, take: number) {
    return prisma.patient.findMany({
      skip,
      take,
      include: {
        user: true
      }
    })
  },

  update(id: string, data: Prisma.PatientUpdateInput) {
    return prisma.patient.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  },

  findByUserId(userId: string) {
    return prisma.patient.findUnique({ where: { userId } });
  },


  findUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  },

  count() {
    return prisma.patient.count();
  },
}