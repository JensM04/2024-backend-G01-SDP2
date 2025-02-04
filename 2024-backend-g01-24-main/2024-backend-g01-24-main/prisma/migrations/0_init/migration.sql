-- CreateTable
CREATE TABLE `ADMINISTRATOR` (
    `ID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `B2BBEDRIJF` (
    `BEDRIJFID` INTEGER NOT NULL AUTO_INCREMENT,
    `EMAIL` VARCHAR(255) NULL,
    `ISACTIEF` BOOLEAN NULL DEFAULT false,
    `NAAM` VARCHAR(255) NULL,
    `SECTOR` VARCHAR(255) NULL,
    `TELEFOONNUMMER` VARCHAR(255) NULL,
    `UUIDVALUE` VARCHAR(255) NULL,
    `WEBSITEURL` VARCHAR(255) NULL,
    `BUS` VARCHAR(255) NULL,
    `GEMEENTE` VARCHAR(255) NULL,
    `HUISNUMMER` INTEGER NULL,
    `POSTCODE` INTEGER NULL,
    `STRAAT` VARCHAR(255) NULL,

    PRIMARY KEY (`BEDRIJFID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BETALING` (
    `BETALINGID` INTEGER NOT NULL AUTO_INCREMENT,
    `BETAALDATUM` DATETIME(0) NULL,
    `BETAALDEBEDRAG` DECIMAL(38, 0) NULL,
    `ISGOEDGEKEURD` BOOLEAN NULL DEFAULT false,
    `ISVERWERKT` BOOLEAN NULL DEFAULT false,
    `TEBETALEN` DECIMAL(38, 0) NULL,
    `KlantID` INTEGER NULL,
    `BestellingID` INTEGER NULL,

    INDEX `FK_BETALING_BestellingID`(`BestellingID`),
    INDEX `FK_BETALING_KlantID`(`KlantID`),
    PRIMARY KEY (`BETALINGID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bestelling` (
    `BESTELLINGID` INTEGER NOT NULL AUTO_INCREMENT,
    `BEDRAG` DECIMAL(38, 0) NULL,
    `BESTELLINGDATUM` DATETIME(0) NULL,
    `BESTELLINGSTATUS` INTEGER NULL,
    `BETAALSTATUS` INTEGER NULL,
    `UUIDVALUE` VARCHAR(255) NULL,
    `BUS` VARCHAR(255) NULL,
    `GEMEENTE` VARCHAR(255) NULL,
    `HUISNUMMER` INTEGER NULL,
    `POSTCODE` INTEGER NULL,
    `STRAAT` VARCHAR(255) NULL,
    `klantid` INTEGER NULL,
    `leverancierid` INTEGER NULL,

    INDEX `FK_Bestelling_klantid`(`klantid`),
    INDEX `FK_Bestelling_leverancierid`(`leverancierid`),
    PRIMARY KEY (`BESTELLINGID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GEBRUIKER` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `DTYPE` VARCHAR(31) NULL,
    `EMAIL` VARCHAR(255) NULL,
    `GEBRUIKERSNAAM` VARCHAR(255) NULL,
    `ISWACHTWOORDVERANDERD` BOOLEAN NULL DEFAULT false,
    `ROL` INTEGER NULL,
    `SALT` VARCHAR(255) NULL,
    `WACHTWOORD_HASH` VARCHAR(255) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KLANT` (
    `ID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KLANT_B2BBEDRIJF` (
    `bedrijf_BEDRIJFID` INTEGER NOT NULL,
    `Klant_ID` INTEGER NOT NULL,

    INDEX `FK_KLANT_B2BBEDRIJF_Klant_ID`(`Klant_ID`),
    PRIMARY KEY (`bedrijf_BEDRIJFID`, `Klant_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LEVERANCIER` (
    `ID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LEVERANCIER_B2BBEDRIJF` (
    `bedrijf_BEDRIJFID` INTEGER NOT NULL,
    `Leverancier_ID` INTEGER NOT NULL,

    INDEX `FK_LEVERANCIER_B2BBEDRIJF_Leverancier_ID`(`Leverancier_ID`),
    PRIMARY KEY (`bedrijf_BEDRIJFID`, `Leverancier_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PRODUCT` (
    `NAAM` VARCHAR(255) NOT NULL,
    `AANTALINSTOCK` INTEGER NULL,
    `EENHEIDSPRIJS` DECIMAL(38, 0) NULL,

    PRIMARY KEY (`NAAM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PRODUCTINBESTELLING` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `AANTAL` INTEGER NULL,
    `B2BBESTELLING_BESTELLINGID` INTEGER NULL,
    `PRODUCTNAAM` VARCHAR(255) NULL,

    INDEX `FK_PRODUCTINBESTELLING_B2BBESTELLING_BESTELLINGID`(`B2BBESTELLING_BESTELLINGID`),
    INDEX `FK_PRODUCTINBESTELLING_PRODUCTNAAM`(`PRODUCTNAAM`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ADMINISTRATOR` ADD CONSTRAINT `FK_ADMINISTRATOR_ID` FOREIGN KEY (`ID`) REFERENCES `GEBRUIKER`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `BETALING` ADD CONSTRAINT `FK_BETALING_BestellingID` FOREIGN KEY (`BestellingID`) REFERENCES `Bestelling`(`BESTELLINGID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `BETALING` ADD CONSTRAINT `FK_BETALING_KlantID` FOREIGN KEY (`KlantID`) REFERENCES `B2BBEDRIJF`(`BEDRIJFID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Bestelling` ADD CONSTRAINT `FK_Bestelling_klantid` FOREIGN KEY (`klantid`) REFERENCES `B2BBEDRIJF`(`BEDRIJFID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Bestelling` ADD CONSTRAINT `FK_Bestelling_leverancierid` FOREIGN KEY (`leverancierid`) REFERENCES `B2BBEDRIJF`(`BEDRIJFID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `KLANT` ADD CONSTRAINT `FK_KLANT_ID` FOREIGN KEY (`ID`) REFERENCES `GEBRUIKER`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `KLANT_B2BBEDRIJF` ADD CONSTRAINT `FK_KLANT_B2BBEDRIJF_Klant_ID` FOREIGN KEY (`Klant_ID`) REFERENCES `GEBRUIKER`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `KLANT_B2BBEDRIJF` ADD CONSTRAINT `FK_KLANT_B2BBEDRIJF_bedrijf_BEDRIJFID` FOREIGN KEY (`bedrijf_BEDRIJFID`) REFERENCES `B2BBEDRIJF`(`BEDRIJFID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `LEVERANCIER` ADD CONSTRAINT `FK_LEVERANCIER_ID` FOREIGN KEY (`ID`) REFERENCES `GEBRUIKER`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `LEVERANCIER_B2BBEDRIJF` ADD CONSTRAINT `FK_LEVERANCIER_B2BBEDRIJF_Leverancier_ID` FOREIGN KEY (`Leverancier_ID`) REFERENCES `GEBRUIKER`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `LEVERANCIER_B2BBEDRIJF` ADD CONSTRAINT `FK_LEVERANCIER_B2BBEDRIJF_bedrijf_BEDRIJFID` FOREIGN KEY (`bedrijf_BEDRIJFID`) REFERENCES `B2BBEDRIJF`(`BEDRIJFID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `PRODUCTINBESTELLING` ADD CONSTRAINT `FK_PRODUCTINBESTELLING_B2BBESTELLING_BESTELLINGID` FOREIGN KEY (`B2BBESTELLING_BESTELLINGID`) REFERENCES `Bestelling`(`BESTELLINGID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `PRODUCTINBESTELLING` ADD CONSTRAINT `FK_PRODUCTINBESTELLING_PRODUCTNAAM` FOREIGN KEY (`PRODUCTNAAM`) REFERENCES `PRODUCT`(`NAAM`) ON DELETE RESTRICT ON UPDATE RESTRICT;

