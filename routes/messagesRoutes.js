const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const payload = {
    pageTitle: "Inbox",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render("inbox", payload);
});
router.get("/:new", (req, res, next) => {
  const payload = {
    pageTitle: "New Message",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render("newMessage", payload);
});

module.exports = router;
