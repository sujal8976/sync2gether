/*
  Warnings:

  - A unique constraint covering the columns `[roomId,youtubeVideoId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Playlist_youtubeVideoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_roomId_youtubeVideoId_key" ON "Playlist"("roomId", "youtubeVideoId");
