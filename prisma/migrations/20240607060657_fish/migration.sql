/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Fish` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fish_nama_key" ON "Fish"("nama");
