-- GitHub profile link, editable from the admin panel (frontend falls back to its built-in one)
ALTER TABLE `About` ADD COLUMN `githubUrl` VARCHAR(191) NULL;
