const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/get-tasks", verifyJWT, getTasks);
router.post("/create-tasks", verifyJWT, createTask);
router.put("/update-tasks/:id", verifyJWT, updateTask);
router.delete("/delete-tasks/:id", verifyJWT, deleteTask);

module.exports = router;
