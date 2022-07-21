/*
  Warnings:

  - You are about to drop the `verificationlink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `verificationlink`;

-- CreateTable
CREATE TABLE `OTP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `OTP` VARCHAR(191) NOT NULL,
    `expiresAt` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
