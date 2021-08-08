const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware");

router.get("/", requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "Notifications",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render("notifications", payload);
});

module.exports = router;
