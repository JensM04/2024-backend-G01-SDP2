-- DropIndex
DROP INDEX `B2BBEDRIJFUPDATEREQUEST_EMAIL_key` ON `b2bbedrijfupdaterequest`;

-- RenameIndex
ALTER TABLE `gebruiker` RENAME INDEX `email` TO `gebruikersnaam`;
-- RenameIndex
ALTER TABLE `gebruiker`
RENAME INDEX `GEBRUIKER_EMAIL_key` TO `email`;