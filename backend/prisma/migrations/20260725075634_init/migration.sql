-- DropIndex
DROP INDEX "Appointment_doctorId_slotStart_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "slotEnd" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Appointment_doctorId_slotStart_idx" ON "Appointment"("doctorId", "slotStart");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_slotEnd_idx" ON "Appointment"("doctorId", "slotEnd");
