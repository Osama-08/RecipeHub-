/*
  Warnings:

  - You are about to drop the column `status` on the `LiveSession` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeVideoId` on the `LiveSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomName]` on the table `LiveSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomName` to the `LiveSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LiveStreamRole" AS ENUM ('HOST', 'COHOST', 'VIEWER');

-- DropIndex
DROP INDEX "LiveSession_status_idx";

-- AlterTable
ALTER TABLE "LiveSession" DROP COLUMN "status",
DROP COLUMN "youtubeVideoId",
ADD COLUMN     "cohostIds" TEXT[],
ADD COLUMN     "isRecorded" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "livekitRoomId" TEXT,
ADD COLUMN     "maxViewers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recordingEndedAt" TIMESTAMP(3),
ADD COLUMN     "recordingId" TEXT,
ADD COLUMN     "recordingStartedAt" TIMESTAMP(3),
ADD COLUMN     "recordingUrl" TEXT,
ADD COLUMN     "roomName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LiveStreamComment" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveStreamComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveStreamLike" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveStreamLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveStreamComment_sessionId_idx" ON "LiveStreamComment"("sessionId");

-- CreateIndex
CREATE INDEX "LiveStreamComment_createdAt_idx" ON "LiveStreamComment"("createdAt");

-- CreateIndex
CREATE INDEX "LiveStreamLike_sessionId_idx" ON "LiveStreamLike"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveStreamLike_sessionId_userId_key" ON "LiveStreamLike"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveSession_roomName_key" ON "LiveSession"("roomName");

-- CreateIndex
CREATE INDEX "LiveSession_roomName_idx" ON "LiveSession"("roomName");

-- CreateIndex
CREATE INDEX "LiveSession_startedAt_idx" ON "LiveSession"("startedAt");

-- AddForeignKey
ALTER TABLE "LiveStreamComment" ADD CONSTRAINT "LiveStreamComment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LiveSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamComment" ADD CONSTRAINT "LiveStreamComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamLike" ADD CONSTRAINT "LiveStreamLike_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LiveSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamLike" ADD CONSTRAINT "LiveStreamLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
