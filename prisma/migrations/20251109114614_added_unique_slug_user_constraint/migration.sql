/*
  Warnings:

  - A unique constraint covering the columns `[user_id,slug]` on the table `lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,slug]` on the table `module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,slug]` on the table `stack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lesson_user_id_slug_key" ON "lesson"("user_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "module_user_id_slug_key" ON "module"("user_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "stack_user_id_slug_key" ON "stack"("user_id", "slug");
