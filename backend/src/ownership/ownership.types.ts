export enum OwnershipResource {
  APPOINTMENT = "appointment",
  MEDICAL_RECORD = "medicalRecord",
  PRESCRIPTION = "prescription",
  INVOICE = "invoice",
}

export interface OwnershipInfo {
  doctorUserId: string;
  patientUserId: string;
}

export type OwnershipOptions = {
  resource: OwnershipResource;
  getResourceId: (req: Request) => string;
};