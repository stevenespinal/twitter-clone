const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const payload = createPayload(req.session.user);

  res.status(200).render("search", payload);
});

router.get("/:selectedTab", (req, res, next) => {
  let payload = createPayload(req.session.user);
  payload.selectedTab = req.params.selectedTab;
  res.status(200).render("search", payload);
});

const createPayload = (user) => {
  return {
    pageTitle: "Search",
    userLoggedIn: user,
    userLoggedInJs: JSON.stringify(user),
    selectedTab: "posts",
  };
};

module.exports = router;
