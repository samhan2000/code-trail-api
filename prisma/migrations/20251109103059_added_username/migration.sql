/*
  Warnings:

  - Added the required column `username` to the `auth_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "username" TEXT NOT NULL;
