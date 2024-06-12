-- AlterTable
ALTER TABLE "Histories" ADD COLUMN     "nameFish" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Histories" ADD CONSTRAINT "Histories_nameFish_fkey" FOREIGN KEY ("nameFish") REFERENCES "Fish"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;
