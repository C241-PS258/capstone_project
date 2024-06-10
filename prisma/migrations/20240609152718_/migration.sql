/*
  Warnings:

  - You are about to drop the column `userId` on the `Histories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Histories" DROP CONSTRAINT "Histories_userId_fkey";

-- DropIndex
DROP INDEX "Histories_userId_key";

-- AlterTable
ALTER TABLE "Histories" DROP COLUMN "userId";
