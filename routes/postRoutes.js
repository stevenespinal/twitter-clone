const express = require("express");
const router = express.Router();

router.get("/:id", (req, res, next) => {
  const payload = {
    pageTitle: "View Post",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id,
  };
  res.status(200).render("post", payload);
});

module.exports = router;
