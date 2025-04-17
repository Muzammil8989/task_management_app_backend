const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ["To Do", "In Progress", "Done"],
        message: "Status must be either 'To Do', 'In Progress', or 'Done'",
      },
      default: "To Do",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      validate: {
        validator: function (value) {
          return value > new Date(); // Deadline must be in the future
        },
        message: "Deadline must be in the future",
      },
    },
  },
  { timestamps: true }
);

// Indexes for optimization
taskSchema.index({ user: 1, status: 1 }); // Useful for user-task filtering
taskSchema.index({ deadline: 1 });        // Useful for sorting/queries by deadline
taskSchema.index({ title: 'text', description: 'text' }); // Enable full-text search

module.exports = mongoose.model("Task", taskSchema);
