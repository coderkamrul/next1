import mongoose, { set } from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
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
    demo: String,
    setupinstructions: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models?.Project ||
  mongoose.model('Project', ProjectSchema)
