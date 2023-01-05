/*
  Warnings:

  - The primary key for the `watchClientMessages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `watchClientMessages` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_watchClientMessages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL
);
INSERT INTO "new_watchClientMessages" ("count", "message", "userId") SELECT "count", "message", "userId" FROM "watchClientMessages";
DROP TABLE "watchClientMessages";
ALTER TABLE "new_watchClientMessages" RENAME TO "watchClientMessages";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
