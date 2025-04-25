/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_organizerId_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "createdAt",
DROP COLUMN "organizerId",
DROP COLUMN "updatedAt";
