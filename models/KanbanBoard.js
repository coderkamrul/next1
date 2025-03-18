const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

const KanbanBoardSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
  todo: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  inProgress: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  review: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  done: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

const KanbanBoard = models.KanbanBoard || model("KanbanBoard", KanbanBoardSchema);

module.exports = KanbanBoard;
