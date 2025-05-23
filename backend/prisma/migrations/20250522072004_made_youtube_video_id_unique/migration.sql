/*
  Warnings:

  - A unique constraint covering the columns `[youtubeVideoId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Playlist_youtubeVideoId_key" ON "Playlist"("youtubeVideoId");
