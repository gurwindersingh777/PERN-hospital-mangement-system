import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { ownershipRepository } from "../ownership/ownership.repository.js";
import { OwnershipOptions, OwnershipResource } from "../ownership/ownership.types.js";
import { ApiError } from "../utils/ApiError.js";
import {
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/statusCode.js";

const receptionistAccess: Record<OwnershipResource, boolean> = {
  [OwnershipResource.APPOINTMENT]: true,
  [OwnershipResource.MEDICAL_RECORD]: false,
  [OwnershipResource.PRESCRIPTION]: false,
  [OwnershipResource.INVOICE]: true,
};

export const authorizeOwnership =
  ({ resource, getResourceId }: OwnershipOptions) =>
    async (
      req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      try {
        if (!req.user) {
          throw new ApiError(
            UNAUTHORIZED,
            "Authentication required"
          );
        }

        const resourceId = getResourceId(req);

        const ownership = await ownershipRepository.findOwner(
          resource,
          resourceId
        );

        if (!ownership) {
          throw new ApiError(
            NOT_FOUND,
            `${resource} not found`
          );
        }

        if (req.user.role === UserRole.ADMIN) {
          return next();
        }

        if (req.user.role === UserRole.RECEPTIONIST) {
          if (receptionistAccess[resource]) {
            return next();
          }

          throw new ApiError(FORBIDDEN, "Access denied");
        }

        if (req.user.role === UserRole.DOCTOR) {
          if (ownership.doctorUserId === req.user.userId) {
            return next();
          }

          throw new ApiError(FORBIDDEN, "Access denied");
        }

        if (req.user.role === UserRole.PATIENT) {
          if (ownership.patientUserId === req.user.userId) {
            return next();
          }

          throw new ApiError(FORBIDDEN, "Access denied");
        }

        throw new ApiError(FORBIDDEN, "Access denied");
      } catch (error) {
        next(error);
      }
    };