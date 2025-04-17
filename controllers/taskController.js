const Task = require("../models/Task");

// Get all tasks with optimized filtering and validation
const getTasks = async (req, res) => {
  try {
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    const {
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      deadline
    } = req.query;

    const filter = { user: req.user.userId };

    if (status) {
      const validStatuses = ["To Do", "In Progress", "Done"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    // Use text search with the index
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Simplified deadline filtering
    if (deadline) {
      if (deadline === 'upcoming') {
        filter.deadline = { $gte: new Date() };
      } else if (deadline === 'past') {
        filter.deadline = { $lt: new Date() };
      } else {
        return res.status(400).json({ message: "Invalid deadline filter. Use 'upcoming' or 'past'" });
      }
    }

    // Sorting configuration
    const sortOptions = {};
    const validSortFields = ['createdAt', 'deadline', 'title'];
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
    }

    // If we're doing a text search, add textScore to sort by relevance
    if (search && search.trim()) {
      sortOptions.score = { $meta: "textScore" };
    }

    // Query execution with lean() for better performance
    const [tasks, count] = await Promise.all([
      Task.find(filter)
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean(),
      Task.countDocuments(filter)
    ]);

    res.json({
      totalTasks: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// Improved createTask with deadline validation
const createTask = async (req, res) => {
  try {
    const { deadline, ...taskData } = req.body;
    const currentDate = new Date();

    if (new Date(deadline) <= currentDate) {
      return res.status(400).json({ message: "Deadline must be in the future" });
    }

    const task = await Task.create({
      ...taskData,
      deadline: new Date(deadline),
      user: req.user.userId
    });

    res.status(201).json(task);
  } catch (error) {
    handleValidationError(error, res);
  }
};

// Optimized updateTask
const updateTask = async (req, res) => {
  try {
    const { deadline, ...updateData } = req.body;
    const currentDate = new Date();

    if (deadline && new Date(deadline) <= currentDate) {
      return res.status(400).json({ message: "Deadline must be in the future" });
    }

    const updateFields = {
      ...updateData,
      ...(deadline && { deadline: new Date(deadline) })
    };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.json(task);
  } catch (error) {
    handleValidationError(error, res);
  }
};

// Delete task remains similar
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({
      message: "Task deleted successfully",
      deletedTask: { id: task._id, title: task.title }
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

// Helper function for handling validation errors
const handleValidationError = (error, res) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
  console.error("Server error:", error);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};