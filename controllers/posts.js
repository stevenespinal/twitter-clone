const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res, next) => {
  if (!req.body.content) {
    console.log("Content is invalid.");
    return res.sendStatus(400);
  }

  let data = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  try {
    let newPost = await Post.create(data);
    newPost = await User.populate(newPost, {
      path: "postedBy",
      select: "-password",
    });
    res.status(201).send(newPost);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

const getPosts = async (req, res, next) => {
  try {
    let results = await Post.find({})
      .populate("postedBy", "-password")
      .sort({ createdAt: -1 });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};
module.exports = { createPost, getPosts };
