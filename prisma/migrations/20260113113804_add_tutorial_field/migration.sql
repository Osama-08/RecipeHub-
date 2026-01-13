/*
  Warnings:

  - You are about to drop the column `recordingUrl` on the `LiveSession` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `LiveSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `LiveSession` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LiveSession_roomId_key";

-- DropIndex
DROP INDEX "LiveSession_sessionId_key";

-- AlterTable
ALTER TABLE "LiveCookingSession" ADD COLUMN     "streamVisibility" TEXT NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "youtubeVideoId" TEXT,
ALTER COLUMN "videoType" SET DEFAULT 'youtube';

-- AlterTable
ALTER TABLE "LiveSession" DROP COLUMN "recordingUrl",
DROP COLUMN "roomId",
DROP COLUMN "sessionId",
ADD COLUMN     "youtubeVideoId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasSeenTutorial" BOOLEAN NOT NULL DEFAULT false;
