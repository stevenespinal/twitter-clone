const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  likePost,
  retweetPost,
} = require("../../controllers/posts");

router.get("/", getPosts);
router.post("/", createPost);
router.post("/:id/retweet", retweetPost);
router.put("/:id/like", likePost);

module.exports = router;
