const mongoose = require('mongoose');

// Schema for signup
const signupSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String // Assuming you'll store the URL of the avatar image
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for login
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Model for signup
const SignupUser = mongoose.model('SignupUser', signupSchema);

// Model for login
const LoginUser = mongoose.model('LoginUser', loginSchema);

module.exports = { SignupUser, LoginUser };
