/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `auth_user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_username_key" ON "auth_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
