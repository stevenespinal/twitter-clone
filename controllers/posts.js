const Post = require("../models/Post");
const User = require("../models/User");

const getPostsAsync = async (filter) => {
  let results = await Post.find(filter)
    .populate("postedBy", "-password")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ createdAt: -1 })
    .catch((error) => console.error(error));

  results = await User.populate(results, {
    path: "replyTo.postedBy",
    select: "-password",
  });
  return await User.populate(results, { path: "retweetData.postedBy" });
};

const createPost = async (req, res, next) => {
  if (!req.body.content) {
    console.log("Content is invalid.");
    return res.sendStatus(400);
  }

  let data = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  if (req.body.replyTo) {
    data.replyTo = req.body.replyTo;
  }

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
  let searchOptions = req.query;

  if (searchOptions?.isReply) {
    let isReply = searchOptions.isReply == "true";
    searchOptions.replyTo = { $exists: isReply };
    delete searchOptions.isReply;
    // console.log(searchOptions);
  }

  if (searchOptions?.followingOnly) {
    let followingOnly = searchOptions.followingOnly == "true";

    if (followingOnly) {
      let objectIds = [];
      if (!req.session.user.following) {
        req.session.user.following = [];
      }
      req.session.user.following.forEach((user) => objectIds.push(user));
      objectIds.push(req.session.user._id);
      searchOptions.postedBy = { $in: objectIds };
    }
    delete searchOptions.followingOnly;
  }

  let results = await getPostsAsync(searchOptions);
  res.status(200).send(results);
};

const getPost = async (req, res, next) => {
  let postData = await getPostsAsync({ _id: req.params.id });
  postData = postData[0];
  // console.log(postData);

  let results = {
    postData,
  };

  if (postData.replyTo !== undefined) {
    results.replyTo = postData.replyTo;
  }

  results.replies = await getPostsAsync({ replyTo: req.params.id });

  res.status(200).send(results);
};

const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.session;
    // console.log(user._id);

    let isLiked = user.likes && user.likes.includes(id);

    // console.log(isLiked);

    // $pull is to remove from the array on mongodb
    // $addToSet will add to the array
    let option = isLiked ? "$pull" : "$addToSet";

    // adding square brackets allows you to add a variable within a mongodb command -> [option]
    req.session.user = await User.findByIdAndUpdate(
      user._id,
      { [option]: { likes: id } },
      { new: true }
    ).catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });

    let post = await Post.findByIdAndUpdate(
      id,
      { [option]: { likes: user._id } },
      { new: true }
    ).catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });

    res.status(200).send(post);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

const retweetPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.session;

    let deletedPost = await Post.findOneAndDelete({
      postedBy: user._id,
      retweetData: id,
    }).catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });

    // $pull is to remove from the array on mongodb
    // $addToSet will add to the array
    let option = deletedPost != null ? "$pull" : "$addToSet";

    let repost = deletedPost;

    if (repost === null) {
      repost = await Post.create({ postedBy: user._id, retweetData: id }).catch(
        (error) => {
          console.error(error);
          res.sendStatus(400);
        }
      );
    }

    // adding square brackets allows you to add a variable within a mongodb command -> [option]
    req.session.user = await User.findByIdAndUpdate(
      user._id,
      { [option]: { retweets: repost._id } },
      { new: true }
    ).catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });

    let post = await Post.findByIdAndUpdate(
      id,
      { [option]: { retweetUsers: user._id } },
      { new: true }
    ).catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });

    res.status(200).send(post);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    // await User.updateOne(
    //   { retweets: req.params.id },
    //   { $pullAll: { uid: [req.params.id] } }
    // );

    res.sendStatus(202);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

const pinPost = async (req, res, next) => {
  if (req.body.pinned !== undefined) {
    await Post.updateMany({ postedBy: req.session.user }, { pinned: false });
  }
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(400));
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  likePost,
  retweetPost,
  deletePost,
  pinPost,
};
