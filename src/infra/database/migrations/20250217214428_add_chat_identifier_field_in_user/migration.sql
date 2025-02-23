/*
  Warnings:

  - A unique constraint covering the columns `[chat]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "chat" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_chat_key" ON "users"("chat");
