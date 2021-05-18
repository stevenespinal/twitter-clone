const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  retweetPost,
  deletePost,
} = require("../../controllers/posts");

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.post("/:id/retweet", retweetPost);
router.put("/:id/like", likePost);
router.delete("/:id", deletePost);

module.exports = router;
