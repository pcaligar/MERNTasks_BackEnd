const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", //The name of the project Schema
  },
});

module.exports = mongoose.model("Task", TaskSchema);
