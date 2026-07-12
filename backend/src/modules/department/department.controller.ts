import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { departmentService } from "./department.service.js";


export const departmentController = {

  create: AsyncHandler(async (req, res) => {
    const department = await departmentService.createDepartment(req.body);
    res.status(CREATED).json(new ApiResponse(CREATED, department, "Department created successfully"));
  }),

  findAll: AsyncHandler(async (req, res) => {
    const departments = await departmentService.findAllDepartments();
    res.status(OK).json(new ApiResponse(OK, departments, "Departments fetched successfully"));
  }),

  findById: AsyncHandler(async (req, res) => {
    const department = await departmentService.findDepartmentById(req.params.id as string);
    res.status(OK).json(new ApiResponse(OK, department, "Department fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const department = await departmentService.updateDepartment(req.params.id as string, req.body);
    res.status(OK).json(new ApiResponse(OK, department, "Department updated successfully"));
  }),
};
