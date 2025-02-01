import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    package: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      deliveryTime: { type: Number, required: true },
      revisions: { type: Number, required: true },
      features: [{ type: String, required: true }],
      price: { type: Number, required: true },
    },
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      message: { type: String, required: true },
    },
    status: {
      type: String,
      default: 'Active',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

export default Order

