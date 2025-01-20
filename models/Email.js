import mongoose from 'mongoose'

const EmailSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    from: { type: String, required: true },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    html: { type: String, required: true },
    submissionId: { type: String, required: false },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Email || mongoose.model('Email', EmailSchema)
