import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    password: String,
    profilePicture: String,
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models?.User || mongoose.model('User', UserSchema)

export default User
