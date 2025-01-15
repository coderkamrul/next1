import mongoose from 'mongoose'

const VersionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const ComponentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    versions: [VersionSchema],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models?.Components ||
  mongoose.model('Components', ComponentsSchema)
