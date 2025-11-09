/*
  Warnings:

  - You are about to drop the `AuthUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuthUser";

-- CreateTable
CREATE TABLE "auth_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tokenVersion" TEXT,
    "refreshTokenVersion" TEXT,
    "isActive" BOOLEAN DEFAULT true,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);
