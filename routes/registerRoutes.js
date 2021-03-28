const express = require("express");
const router = express.Router();
const { register } = require("../controllers/user");

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});

router.post("/", register);

module.exports = router;
