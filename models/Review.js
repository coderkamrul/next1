import mongoose from 'mongoose'
const ReviewSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    projectImage: { type: String, required: true },
    profilePicture: { type: String, required: false },
    review: { type: String, required: true },
    reply: { type: String, required: true },
    rating: { type: Number, required: true },
    projectLink: { type: String, required: false },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
const { Schema } = mongoose
