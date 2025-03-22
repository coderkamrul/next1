import { Schema, model, models } from "mongoose"
import { Client } from "./Client"
const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["planning", "in-progress", "on-hold", "completed"],
      default: "planning",
    },
    budget: { type: Number, required: true, default: 0 },
    progress: { type: Number, required: true, default: 0 },
    dueDate: { type: Date, required: true },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    notes: { type: String },
    comments: { type: String },
    image: { type: String },
  },
  { timestamps: true },
)

export const Project = models.Projectmanage || model("Projectmanage", ProjectSchema)

