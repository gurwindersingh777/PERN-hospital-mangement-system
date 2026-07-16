import { CONFLICT, NOT_FOUND } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { departmentRepository } from "./department.repository.js";
import { toDepartmentResponse } from "./department.response.js";
import { DepartmentInput, UpdateDepartmentInput } from "./department.schema.js";

export const departmentService = {
  async createDepartment(data: DepartmentInput) {
    const existingDepartment = await departmentRepository.findByName(data.name);

    if (existingDepartment) {
      throw new ApiError(CONFLICT, "Department already exists");
    }

    const department = await departmentRepository.create(data);
    return toDepartmentResponse(department);
  },

  async findAllDepartments() {
    const departments = await departmentRepository.findAll();
    return departments.map(toDepartmentResponse);
  },

  async findDepartmentById(id: string) {
    const department = await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(NOT_FOUND, "Department not found");
    }

    return toDepartmentResponse(department);
  },

  async updateDepartment(id: string, data: UpdateDepartmentInput) {
    const existing = await departmentRepository.findById(id);

    if (!existing) {
      throw new ApiError(NOT_FOUND, "Department not found");
    }

    if (data.name) {
      const department = await departmentRepository.findByName(data.name);

      if (department && department.id !== id) {
        throw new ApiError(CONFLICT, "Department already exists");
      }
    }

    const department = await departmentRepository.update(id, data);
    return toDepartmentResponse(department);
  },
};
