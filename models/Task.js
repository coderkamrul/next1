import { Schema, model, models } from "mongoose"

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignee: {
      name: { type: String },
      avatar: { type: String },
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    status: {
      type: String,
      required: true,
      enum: ["todo", "inProgress", "review", "done"],
      default: "todo",
    },
  },
  { timestamps: true },
)

export const Tasks = models.Tasks || model("Tasks", TaskSchema)

