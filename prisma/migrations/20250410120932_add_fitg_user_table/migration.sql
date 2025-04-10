-- AlterTable
ALTER TABLE "fitg_match" ADD COLUMN     "userEmail" TEXT;

-- CreateTable
CREATE TABLE "fitg_user" (
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "fitg_user_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "fitg_user_displayName_key" ON "fitg_user"("displayName");

-- CreateIndex
CREATE INDEX "fitg_match_currentScore_idx" ON "fitg_match"("currentScore");

-- AddForeignKey
ALTER TABLE "fitg_match" ADD CONSTRAINT "fitg_match_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "fitg_user"("email") ON DELETE SET NULL ON UPDATE CASCADE;
