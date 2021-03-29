const express = require("express");
const router = express.Router();
const { createPost, getPosts } = require("../../controllers/posts");

router.get("/", getPosts);
router.post("/", createPost);

module.exports = router;
