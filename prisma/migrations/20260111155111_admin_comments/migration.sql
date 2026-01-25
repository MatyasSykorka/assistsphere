/*
  Warnings:

  - You are about to drop the column `admin_comment` on the `ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "admin_comment",
ADD COLUMN     "adminOrManager_comment" TEXT;
