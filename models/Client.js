import { Schema, model, models } from "mongoose"

const ClientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    image: { type: String },
  },
  { timestamps: true },
)

export const Client = models.Client || model("Client", ClientSchema)

