const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res, next) => {
  const payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };
  res.status(200).render("profile", payload);
});

router.get("/:username", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  res.status(200).render("profile", payload);
});

router.get("/:username/replies", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "replies";
  res.status(200).render("profile", payload);
});

router.get("/:username/following", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "following";
  res.status(200).render("followers", payload);
});

router.get("/:username/followers", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "followers";
  res.status(200).render("followers", payload);
});

const getPayload = async (username, userLoggedIn) => {
  let user = await User.findOne({ username: username });

  if (!user) {
    user = await User.findById(username);
    if (!user) {
      return {
        pageTitle: "User Not Found",
        username: username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
      };
    }
  }

  return {
    pageTitle: user.username,
    userLoggedIn: userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user,
  };
};

module.exports = router;
