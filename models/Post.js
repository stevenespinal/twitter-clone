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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetData: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    pinned: Boolean,
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);

module.exports = Post;
