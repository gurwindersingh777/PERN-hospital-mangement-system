import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const doctorRepository = {
  create: async (data: Prisma.DoctorUncheckedCreateInput) => {
    return prisma.doctor.create({
      data,
      include: {
        user: true,
        department: true,
      },
    });
  },

  findById: async (id: string) => {
    return prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
      },
    });
  },

  findAll(skip: number, take: number) {
    return prisma.doctor.findMany({
      skip,
      take,
      include: {
        user: true,
        department: true,
      },
    });
  },

  findByUserId: async (userId: string) => {
    return prisma.doctor.findUnique({ where: { userId } });
  },

  update(id: string, data: Prisma.DoctorUpdateInput) {
    return prisma.doctor.update({
      where: { id },
      data,
      include: {
        user: true,
        department: true,
      },
    });
  },

  findDepartmentById: async (departmentId: string) => {
    return prisma.department.findUnique({ where: { id: departmentId } });
  },

  findUserById: async (userId: string) => {
    return prisma.user.findUnique({ where: { id: userId } });
  },

  count: async () => {
    return prisma.doctor.count();
  },
};
