-- CreateTable
CREATE TABLE "Match" (
    "cryptographicallyStrongRandomToken" TEXT NOT NULL,
    "currentScore" INTEGER NOT NULL,
    "currentHealth" INTEGER NOT NULL,
    "currentQuestionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("cryptographicallyStrongRandomToken")
);
