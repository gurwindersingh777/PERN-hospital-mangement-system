import { Department } from "@prisma/client";

export const toDepartmentResponse = (department: Department) => {
  return {
    id: department.id,
    name: department.name,
    description: department.description,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt
  };
};