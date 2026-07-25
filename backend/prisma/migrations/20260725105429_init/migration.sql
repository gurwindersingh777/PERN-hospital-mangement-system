/*
  Warnings:

  - You are about to drop the column `workingHours` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "workingHours",
ADD COLUMN     "workEndTime" TEXT,
ADD COLUMN     "workStartTime" TEXT;
