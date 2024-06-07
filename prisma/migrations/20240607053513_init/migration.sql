-- CreateTable
CREATE TABLE "Fish" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "pakan" TEXT NOT NULL,
    "pemeliharaan" TEXT NOT NULL,

    CONSTRAINT "Fish_pkey" PRIMARY KEY ("id")
);
