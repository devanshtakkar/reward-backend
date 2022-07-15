/*
  Warnings:

  - Added the required column `createTime` to the `codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `codes` ADD COLUMN `createTime` BIGINT NOT NULL,
    MODIFY `claimeTime` BIGINT NULL;

-- CreateTable
CREATE TABLE `verificationLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `expiresAt` BIGINT NOT NULL,

    UNIQUE INDEX `verificationLink_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
