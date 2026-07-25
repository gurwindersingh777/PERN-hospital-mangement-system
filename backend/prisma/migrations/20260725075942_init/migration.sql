-- DropIndex
DROP INDEX "Appointment_doctorId_idx";

-- DropIndex
DROP INDEX "Appointment_doctorId_slotEnd_idx";

-- DropIndex
DROP INDEX "Appointment_slotStart_idx";

-- CreateIndex
CREATE INDEX "Appointment_doctorId_status_slotStart_idx" ON "Appointment"("doctorId", "status", "slotStart");
