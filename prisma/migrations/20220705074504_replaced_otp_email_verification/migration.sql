/*
  Warnings:

  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `emailVerified` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `otp_forEmail_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerified` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `otp`;
