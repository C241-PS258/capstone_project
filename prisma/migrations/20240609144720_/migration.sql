-- CreateTable
CREATE TABLE "Histories" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Histories_userId_key" ON "Histories"("userId");

-- AddForeignKey
ALTER TABLE "Histories" ADD CONSTRAINT "Histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
