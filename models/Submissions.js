import mongoose from 'mongoose'
const SubmissionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Submission ||
  mongoose.model('Submission', SubmissionSchema)
