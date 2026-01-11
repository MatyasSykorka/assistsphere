/*
  Warnings:

  - You are about to drop the column `ticket_id` on the `admin_or_manager_comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admin_or_manager_comment_id]` on the table `ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "admin_or_manager_comment" DROP CONSTRAINT "admin_or_manager_comment_ticket_id_fkey";

-- DropIndex
DROP INDEX "admin_or_manager_comment_ticket_id_key";

-- AlterTable
ALTER TABLE "admin_or_manager_comment" DROP COLUMN "ticket_id";

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "admin_or_manager_comment_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ticket_admin_or_manager_comment_id_key" ON "ticket"("admin_or_manager_comment_id");

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_admin_or_manager_comment_id_fkey" FOREIGN KEY ("admin_or_manager_comment_id") REFERENCES "admin_or_manager_comment"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
