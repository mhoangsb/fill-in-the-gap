/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Match";

-- CreateTable
CREATE TABLE "fitg_match" (
    "cryptographicallyStrongRandomToken" TEXT NOT NULL,
    "currentScore" INTEGER NOT NULL,
    "currentHealth" INTEGER NOT NULL,
    "currentQuestionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fitg_match_pkey" PRIMARY KEY ("cryptographicallyStrongRandomToken")
);
