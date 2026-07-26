import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetMedicalRecordInput } from "./medicalRecord.schema.js";
import { medicalRecordService } from "./medicalRecord.service.js";

export const medicalRecordController = {
  create: AsyncHandler(async (req, res) => {
    const record = await medicalRecordService.create(req.body);

    return res
      .status(CREATED)
      .json(
        new ApiResponse(CREATED, record, "Medical Record created successfully")
      );
  }),

  findAll: AsyncHandler(async (req, res) => {
    const records = await medicalRecordService.findAll(
      req.query as unknown as GetMedicalRecordInput
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, records, "Medical Records fetched successfully")
      );
  }),

  findById: AsyncHandler(async (req, res) => {
    const record = await medicalRecordService.findById(req.params.id as string);
    return res
      .status(OK)
      .json(new ApiResponse(OK, record, "Medical Record fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const record = await medicalRecordService.update(
      req.params.id as string,
      req.body
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, record, "Medical Record updated successfully"));
  }),
};
