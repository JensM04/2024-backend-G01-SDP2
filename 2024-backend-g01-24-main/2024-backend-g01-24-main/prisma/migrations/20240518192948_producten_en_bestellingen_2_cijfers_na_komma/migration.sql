/*
  Warnings:

  - You are about to alter the column `BEDRAG` on the `bestelling` table. The data in that column could be lost. The data in that column will be cast from `Decimal(38,0)` to `Decimal(38,2)`.
  - You are about to alter the column `EENHEIDSPRIJS` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(38,0)` to `Decimal(38,2)`.

*/
-- AlterTable
ALTER TABLE `b2bbedrijf` ADD COLUMN `BTWNr` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `bestelling` MODIFY `BEDRAG` DECIMAL(38, 2) NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `EENHEIDSPRIJS` DECIMAL(38, 2) NULL;
