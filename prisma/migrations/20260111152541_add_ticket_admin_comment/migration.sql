/*
  Warnings:

  - Made the column `role_id` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "admin_comment" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role_id" SET NOT NULL;
