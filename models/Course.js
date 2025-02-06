
import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ChapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lectures: [LectureSchema],
  },
  { timestamps: true }
);

const CourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    
    image: {
      type: String,
      required: true,
    },
    chapters: [ChapterSchema],
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "draft"],
      default: "draft",
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: true,
    },
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
);

export default mongoose.models.Course ||
  mongoose.model("Course", CourseSchema);

