/**
 * @fileoverview This file defines the Mongoose schema for Users.
 * A user is typically an administrator who can log in to the admin panel.
 */
import mongoose from 'mongoose';

/**
 * Mongoose schema for a User.
 */
const UserSchema = new mongoose.Schema({
  /**
   * The unique username for the user.
   */
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
  },
  /**
   * The hashed password for the user.
   */
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  /**
   * A flag to indicate if the user must change their password on the next login.
   * This is useful for initial setup or password resets.
   */
  forcePasswordChange: {
    type: Boolean,
    default: true,
  },
});

// The following line prevents the model from being compiled more than once.
// This is a workaround for a known issue with Next.js and Mongoose in development mode.
export default mongoose.models.User || mongoose.model('User', UserSchema);
