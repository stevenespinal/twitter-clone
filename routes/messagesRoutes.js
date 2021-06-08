const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();

router.get("/", (req, res, next) => {
  const payload = {
    pageTitle: "Inbox",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render("inbox", payload);
});

router.get("/new", (req, res, next) => {
  const payload = {
    pageTitle: "New Message",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render("newMessage", payload);
});

router.get("/:chatId", async (req, res, next) => {
  let userId = req.session.user._id;
  const { chatId } = req.params;

  // checks the chat where the id is from url params and where the current logged in user is inside of that chat array

  let chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate("users", "-password");

  if (chat === null) {
  }

  const payload = {
    pageTitle: "Chat",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    chat: chat,
  };

  console.log(payload);
  res.status(200).render("chat", payload);
});

module.exports = router;
