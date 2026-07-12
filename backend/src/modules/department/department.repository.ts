import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export const departmentRepository = {

  async create(data: Prisma.DepartmentCreateInput) {
    return prisma.department.create({ data });
  },

  async findById(id: string) {
    return prisma.department.findUnique({ where: { id } });
  },

  async findAll() {
    return prisma.department.findMany({ orderBy: { name : "asc" } });
  },

  async findByName(name: string) {
    return prisma.department.findUnique({ where: { name } });
  },

  async update(id: string, data: Prisma.DepartmentUpdateInput) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }
}