/*
  Warnings:

  - Added the required column `slug` to the `lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `stack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "progress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "module" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stack" ADD COLUMN     "slug" TEXT NOT NULL;
