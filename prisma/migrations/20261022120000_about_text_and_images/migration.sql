-- Admin-editable tagline and site texts; photo and favicon stored inline as data URLs
ALTER TABLE `About` MODIFY `photoUrl` MEDIUMTEXT NULL,
    ADD COLUMN `faviconUrl` MEDIUMTEXT NULL,
    ADD COLUMN `tagline` TEXT NULL,
    ADD COLUMN `texts` JSON NULL;
