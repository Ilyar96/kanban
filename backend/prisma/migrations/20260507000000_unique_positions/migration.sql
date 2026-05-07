DROP INDEX IF EXISTS "Column_boardId_position_idx";
DROP INDEX IF EXISTS "Task_columnId_position_idx";

CREATE UNIQUE INDEX "Column_boardId_position_key" ON "Column"("boardId", "position");
CREATE UNIQUE INDEX "Task_columnId_position_key" ON "Task"("columnId", "position");
