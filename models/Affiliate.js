import mongoose, { Schema } from 'mongoose'

const AffiliateSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    affiliateLink: {
      type: String,
      required: [true, 'Please provide an affiliate link'],
      unique: true,
    },
    affiliateName: {
      type: String,
      required: [true, 'Please provide an affiliate name'],
    },
    affiliateDescription: {
      type: String,
      required: [true, 'Please provide an affiliate description'],
    },
    affiliateImage: {
      type: String,
      required: [true, 'Please provide an affiliate image'],
    },
    affiliateCategory: {
      type: String,
      required: [true, 'Please provide an affiliate category'],
    },
    clicks: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models?.Affiliate ||
  mongoose.model('Affiliate', AffiliateSchema)
