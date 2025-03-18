import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    title: {
      type: String,
      required: [true, 'Please provide a title for this project.'],
      maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this project.'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL for this project.'],
    },
    details: {
      framework: String,
      useCase: String,
      css: String,
      deployment: String,
    },
    techStack: [String],
    link: String,
    tags: [String],
    github: String,
    setupinstructions: {
      type: Object,
      type: [],
      time: Number,
      blocks: [],
      version: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models?.Projects ||
  mongoose.model('Projects', ProjectSchema)
