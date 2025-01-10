import mongoose, { Schema } from 'mongoose'

const authorSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: false }
)

const commentSchema = new Schema(
  {
    author: { type: authorSchema, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: {
      type: Object,
      type: [],
      time: Number,
      blocks: [],
      version: String,
    },
    image: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    author: { type: authorSchema, required: true },
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
