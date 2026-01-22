/*
  Warnings:

  - Added the required column `thumbnailData` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailType` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "thumbnailData" BYTEA NOT NULL,
ADD COLUMN     "thumbnailType" TEXT NOT NULL;
