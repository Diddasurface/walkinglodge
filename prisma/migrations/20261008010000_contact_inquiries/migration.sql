-- Contact inquiries share the booking workflow without requiring a registered user.
ALTER TABLE `Booking`
  MODIFY `userId` VARCHAR(191) NULL,
  MODIFY `totalAmount` DOUBLE NULL,
  MODIFY `startDate` DATETIME(3) NULL,
  MODIFY `endDate` DATETIME(3) NULL,
  ADD COLUMN `source` VARCHAR(191) NOT NULL DEFAULT 'DASHBOARD',
  ADD COLUMN `contactName` VARCHAR(191) NULL,
  ADD COLUMN `contactEmail` VARCHAR(191) NULL,
  ADD COLUMN `contactPhone` VARCHAR(191) NULL,
  ADD COLUMN `nationality` VARCHAR(191) NULL,
  ADD COLUMN `destinationInterest` VARCHAR(191) NULL,
  ADD COLUMN `requestedDates` VARCHAR(191) NULL,
  ADD COLUMN `message` TEXT NULL;
