/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Pairing` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Pairing` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pairing" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
