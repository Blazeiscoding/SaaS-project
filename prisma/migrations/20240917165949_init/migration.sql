/*
  Warnings:

  - You are about to drop the column `originaSize` on the `Video` table. All the data in the column will be lost.
  - Added the required column `originalSize` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "originaSize",
ADD COLUMN     "originalSize" TEXT NOT NULL;
