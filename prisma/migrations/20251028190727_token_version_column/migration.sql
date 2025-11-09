/*
  Warnings:

  - You are about to drop the column `refreshTokenVersion` on the `auth_user` table. All the data in the column will be lost.
  - You are about to drop the column `tokenVersion` on the `auth_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `auth_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "auth_user" DROP COLUMN "refreshTokenVersion",
DROP COLUMN "tokenVersion";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "refreshTokenVersion" TEXT,
ADD COLUMN     "tokenVersion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth_user"("email");
