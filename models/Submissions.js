import mongoose from 'mongoose'
const SubmissionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    viewed:{ type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Submission ||
  mongoose.model('Submission', SubmissionSchema)
