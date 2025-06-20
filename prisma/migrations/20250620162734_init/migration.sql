/*
  Warnings:

  - Added the required column `cashierName` to the `CustomTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `CustomTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `CustomTransaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `totalAmount` on table `CustomTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CustomTransaction" ADD COLUMN     "arrival" TEXT,
ADD COLUMN     "cashierName" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "departure" TEXT,
ADD COLUMN     "serviceType" TEXT NOT NULL,
ALTER COLUMN "totalAmount" SET NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "totalAmount" SET DATA TYPE TEXT;
