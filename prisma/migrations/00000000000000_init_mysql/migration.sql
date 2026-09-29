-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'CLIENT',
    `phone` VARCHAR(191) NULL,
    `avatarUrl` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NULL,
    `passportNumber` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `emergencyContact` VARCHAR(191) NULL,
    `medicalNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Destination` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `regionEs` VARCHAR(191) NOT NULL,
    `regionEn` VARCHAR(191) NOT NULL,
    `nameEs` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `shortEs` VARCHAR(191) NOT NULL,
    `shortEn` VARCHAR(191) NOT NULL,
    `subEs` VARCHAR(191) NOT NULL,
    `subEn` VARCHAR(191) NOT NULL,
    `descEs` TEXT NOT NULL,
    `descEn` TEXT NOT NULL,
    `coverImg` TEXT NOT NULL,
    `tag` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `altitudeM` INTEGER NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `experienceEs` TEXT NULL,
    `experienceEn` TEXT NULL,
    `durationDays` INTEGER NULL,
    `mapAddress` TEXT NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactWhatsapp` VARCHAR(191) NULL,

    UNIQUE INDEX `Destination_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationWarning` (
    `id` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `textEs` TEXT NOT NULL,
    `textEn` TEXT NOT NULL,
    `severity` VARCHAR(191) NOT NULL DEFAULT 'warning',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationDay` (
    `id` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `titleEs` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `descEs` TEXT NULL,
    `descEn` TEXT NULL,
    `mealsEs` TEXT NULL,
    `mealsEn` TEXT NULL,

    UNIQUE INDEX `DestinationDay_destinationId_dayNumber_key`(`destinationId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationImage` (
    `id` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'image',
    `url` TEXT NOT NULL,
    `provider` VARCHAR(191) NULL,
    `thumbUrl` TEXT NULL,
    `captionEs` TEXT NULL,
    `captionEn` TEXT NULL,
    `altEs` TEXT NULL,
    `altEn` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hotel` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `nameEs` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `descEs` TEXT NULL,
    `descEn` TEXT NULL,
    `stars` INTEGER NOT NULL,
    `coverImg` TEXT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` TEXT NULL,
    `checkInTime` VARCHAR(191) NULL,
    `checkOutTime` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `destinationId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Hotel_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotelImage` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `altEs` TEXT NULL,
    `altEn` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotelAmenity` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `nameEs` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `typeEs` VARCHAR(191) NOT NULL,
    `typeEn` VARCHAR(191) NOT NULL,
    `descEs` TEXT NULL,
    `descEn` TEXT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 2,
    `beds` INTEGER NOT NULL DEFAULT 1,
    `coverImg` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomAmenity` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `nameEs` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Season` (
    `id` VARCHAR(191) NOT NULL,
    `nameEs` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomPrice` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `seasonId` VARCHAR(191) NOT NULL,
    `pricePerNight` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RoomPrice_roomId_seasonId_key`(`roomId`, `seasonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tour` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `titleEs` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `subEs` VARCHAR(191) NULL,
    `subEn` VARCHAR(191) NULL,
    `descEs` TEXT NULL,
    `descEn` TEXT NULL,
    `durationDays` INTEGER NOT NULL,
    `durationNights` INTEGER NOT NULL,
    `levelEs` VARCHAR(191) NOT NULL,
    `levelEn` VARCHAR(191) NOT NULL,
    `coverImg` TEXT NOT NULL,
    `minPax` INTEGER NOT NULL DEFAULT 1,
    `maxPax` INTEGER NOT NULL DEFAULT 20,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,

    UNIQUE INDEX `Tour_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourDay` (
    `id` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `titleEs` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `descEs` TEXT NULL,
    `descEn` TEXT NULL,
    `accommodation` TEXT NULL,
    `meals` VARCHAR(191) NULL,

    UNIQUE INDEX `TourDay_tourId_dayNumber_key`(`tourId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourPrice` (
    `id` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `seasonId` VARCHAR(191) NULL,
    `paxMin` INTEGER NOT NULL DEFAULT 1,
    `paxMax` INTEGER NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',

    UNIQUE INDEX `TourPrice_tourId_seasonId_paxMin_key`(`tourId`, `seasonId`, `paxMin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourImage` (
    `id` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `altEs` TEXT NULL,
    `altEn` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourInclusion` (
    `id` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `textEs` TEXT NOT NULL,
    `textEn` TEXT NOT NULL,
    `included` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourDestination` (
    `tourId` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tourId`, `destinationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourGuide` (
    `tourId` VARCHAR(191) NOT NULL,
    `guideId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tourId`, `guideId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guide` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `baseEs` VARCHAR(191) NOT NULL,
    `baseEn` VARCHAR(191) NOT NULL,
    `years` INTEGER NOT NULL,
    `langs` VARCHAR(191) NOT NULL,
    `specEs` VARCHAR(191) NOT NULL,
    `specEn` VARCHAR(191) NOT NULL,
    `bioEs` TEXT NOT NULL,
    `bioEn` TEXT NOT NULL,
    `img` TEXT NOT NULL,
    `licenseNo` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `totalAmount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `pax` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `specialRequests` TEXT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Booking_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingTour` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `guideId` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `pax` INTEGER NOT NULL,
    `pricePerPax` DOUBLE NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingHotel` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NULL,
    `checkIn` DATETIME(3) NOT NULL,
    `checkOut` DATETIME(3) NOT NULL,
    `nights` INTEGER NOT NULL,
    `guests` INTEGER NOT NULL,
    `pricePerNight` DOUBLE NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `transactionId` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `destinationId` VARCHAR(191) NULL,
    `tourId` VARCHAR(191) NULL,
    `hotelId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destination` ADD CONSTRAINT `Destination_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationWarning` ADD CONSTRAINT `DestinationWarning_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationDay` ADD CONSTRAINT `DestinationDay_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationImage` ADD CONSTRAINT `DestinationImage_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelImage` ADD CONSTRAINT `HotelImage_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelAmenity` ADD CONSTRAINT `HotelAmenity_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomAmenity` ADD CONSTRAINT `RoomAmenity_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomPrice` ADD CONSTRAINT `RoomPrice_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomPrice` ADD CONSTRAINT `RoomPrice_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `Season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tour` ADD CONSTRAINT `Tour_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourDay` ADD CONSTRAINT `TourDay_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPrice` ADD CONSTRAINT `TourPrice_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPrice` ADD CONSTRAINT `TourPrice_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `Season`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourImage` ADD CONSTRAINT `TourImage_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourInclusion` ADD CONSTRAINT `TourInclusion_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourDestination` ADD CONSTRAINT `TourDestination_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourDestination` ADD CONSTRAINT `TourDestination_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourGuide` ADD CONSTRAINT `TourGuide_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourGuide` ADD CONSTRAINT `TourGuide_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guide` ADD CONSTRAINT `Guide_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingTour` ADD CONSTRAINT `BookingTour_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingTour` ADD CONSTRAINT `BookingTour_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingTour` ADD CONSTRAINT `BookingTour_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingHotel` ADD CONSTRAINT `BookingHotel_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingHotel` ADD CONSTRAINT `BookingHotel_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingHotel` ADD CONSTRAINT `BookingHotel_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tour`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

