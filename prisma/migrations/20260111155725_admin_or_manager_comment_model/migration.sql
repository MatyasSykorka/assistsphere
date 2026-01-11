/*
  Warnings:

  - You are about to drop the column `adminOrManager_comment` on the `ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "adminOrManager_comment";

-- CreateTable
CREATE TABLE "admin_or_manager_comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "ticket_id" INTEGER NOT NULL,

    CONSTRAINT "admin_or_manager_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_or_manager_comment_ticket_id_key" ON "admin_or_manager_comment"("ticket_id");

-- AddForeignKey
ALTER TABLE "admin_or_manager_comment" ADD CONSTRAINT "admin_or_manager_comment_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("ticket_id") ON DELETE CASCADE ON UPDATE NO ACTION;
