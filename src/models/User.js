const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default: "https://geographyandyou.com/images/user-profile.png",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  age: {
    type: Number,
    min: 18,
  },
  about: {
    type: String,
    default: "Hello! I'm a developer.",
  },
  skills: {
    type: [String],
    default: [],
  }
},
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;