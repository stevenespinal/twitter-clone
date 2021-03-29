const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pinned: Boolean,
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);

module.exports = Post;
