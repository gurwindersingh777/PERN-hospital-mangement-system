import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetAppointmentsInput } from "./appointment.schema.js";
import { appointmentService } from "./appointment.service.js";


export const appointmentController = {
  create: AsyncHandler(async (req, res) => {
    const appointment = await appointmentService.create(req.body);

    return res
      .status(CREATED)
      .json(
        new ApiResponse(CREATED, appointment, "Appointment booked successfully")
      );
  }),

  findAll: AsyncHandler(async (req, res) => {
    const result = await appointmentService.findAll(
      req.query as unknown as GetAppointmentsInput
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, result, "Appointments fetched successfully")
      );
  }),

  findById: AsyncHandler(async (req, res) => {
    const appointment = await appointmentService.findById(req.params.id as string);
    return res
      .status(OK)
      .json(new ApiResponse(OK, appointment, "Appointment fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const appointment = await appointmentService.update(
      req.params.id as string,
      req.body
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, appointment, "Appointment updated successfully"));
  }),
};
