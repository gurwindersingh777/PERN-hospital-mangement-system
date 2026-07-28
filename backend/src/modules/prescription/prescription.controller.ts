import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetPrescriptionInput } from "./prescription.schema.js";
import { prescriptionService } from "./prescription.service.js";

export const prescriptionController = {
  create: AsyncHandler(async (req, res) => {
    const prescription = await prescriptionService.create(req.body);

    return res
      .status(CREATED)
      .json(
        new ApiResponse(
          CREATED,
          prescription,
          "Prescription created successfully"
        )
      );
  }),

  findAll: AsyncHandler(async (req, res) => {
    const prescriptions = await prescriptionService.findAll(
      req.query as unknown as GetPrescriptionInput
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, prescriptions, "Prescriptions fetched successfully")
      );
  }),

  findById: AsyncHandler(async (req, res) => {
    const prescription = await prescriptionService.findById(
      req.params.id as string
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, prescription, "Prescription fetched successfully")
      );
  }),

  update: AsyncHandler(async (req, res) => {
    const prescription = await prescriptionService.update(
      req.params.id as string,
      req.body
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, prescription, "Prescriptions updated successfully")
      );
  }),
};
