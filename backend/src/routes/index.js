const express = require("express");
const authRoutes = require("./auth.routes");
const boardsRoutes = require("./boards.routes");
const columnsRoutes = require("./columns.routes");
const tasksRoutes = require("./tasks.routes");
const invitationsRoutes = require("./invitations.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/boards", boardsRoutes);
router.use("/columns", columnsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/invitations", invitationsRoutes);

module.exports = router;
