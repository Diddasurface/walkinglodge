INSERT INTO `SiteSetting` (`key`, `value`, `createdAt`, `updatedAt`)
VALUES ('logoUrl', '/images/amazon-walking-logo.webp', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `value` = '/images/amazon-walking-logo.webp',
  `updatedAt` = CURRENT_TIMESTAMP(3);
