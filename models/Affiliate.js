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
    profileImage: {
      type: String,
      required: [true, 'Please provide a profile image'],
    },
    affiliateCategory: {
      type: String,
      required: [true, 'Please provide an affiliate category'],
    },
    price: {
      type: String,
      required: [true, 'Please provide a price'],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: false,
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
