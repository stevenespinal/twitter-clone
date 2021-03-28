const express = require("express");
const router = express.Router();
const { signIn } = require("../controllers/auth");

router.get("/", (req, res, next) => {
  const payload = {
    pageTitle: "Sign In",
  };
  res.status(200).render("login", payload);
});

router.post("/", signIn);

module.exports = router;
