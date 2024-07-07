/*
  Warnings:

  - Added the required column `organizerId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "organizerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
