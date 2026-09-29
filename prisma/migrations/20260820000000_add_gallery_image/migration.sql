-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `titleEs` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `captionEs` TEXT NULL,
    `captionEn` TEXT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'naturaleza',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
