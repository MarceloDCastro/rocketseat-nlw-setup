-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dayHabits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    CONSTRAINT "dayHabits_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dayHabits_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dayHabits" ("dayId", "habitId", "id") SELECT "dayId", "habitId", "id" FROM "dayHabits";
DROP TABLE "dayHabits";
ALTER TABLE "new_dayHabits" RENAME TO "dayHabits";
CREATE UNIQUE INDEX "dayHabits_dayId_habitId_key" ON "dayHabits"("dayId", "habitId");
CREATE TABLE "new_habitWeekDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    CONSTRAINT "habitWeekDays_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habitWeekDays" ("habitId", "id", "weekDay") SELECT "habitId", "id", "weekDay" FROM "habitWeekDays";
DROP TABLE "habitWeekDays";
ALTER TABLE "new_habitWeekDays" RENAME TO "habitWeekDays";
CREATE UNIQUE INDEX "habitWeekDays_habitId_weekDay_key" ON "habitWeekDays"("habitId", "weekDay");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
