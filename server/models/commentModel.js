import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "experience",
  },
});

const commentModel = mongoose.model("comment", commentSchema);

export { commentModel };
