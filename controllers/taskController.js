const Task = require("../models/Task");

// Get all tasks with pagination, search, and filter
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const filter = { user: req.user.userId };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Task.countDocuments(filter);

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = new Task({
      user: req.user.userId,
      title,
      description,
      status,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Invalid task data" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
