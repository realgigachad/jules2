import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  forcePasswordChange: {
    type: Boolean,
    default: true,
  },
});

// In a serverless environment like Next.js, we need to prevent the model from being redefined on every hot reload.
export default mongoose.models.User || mongoose.model('User', UserSchema);
