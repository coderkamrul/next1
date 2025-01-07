import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  profilePicture: String,
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
})

const User = mongoose.models?.User || mongoose.model('User', UserSchema)

export default User
