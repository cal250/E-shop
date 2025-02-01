/*
  Warnings:

  - You are about to drop the column `birth_of_date` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "birth_of_date",
ADD COLUMN     "role" TEXT DEFAULT 'USER';
