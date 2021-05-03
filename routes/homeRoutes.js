const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware");

router.get("/", requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "Home Page",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render("home", payload);
});

module.exports = router;
