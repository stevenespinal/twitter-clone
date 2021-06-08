const express = require("express");
const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const User = require("../models/User");
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
  let chatId = req.params.chatId;

  let isValidId = mongoose.isValidObjectId(chatId);

  let chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate("users", "-password");

  var payload = {
    pageTitle: "Chat",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  if (!isValidId) {
    payload.errorMessage =
      "Chat does not exist or you do not have permission to view it.";
    return res.status(200).render("chat", payload);
  }
  // checks the chat where the id is from url params and where the current logged in user is inside of that chat array

  if (chat === null) {
    let userFound = await User.findById(chatId).select("-password");

    if (userFound !== null) {
      chat = await getChatByUserId(userFound._id, userId);
    }
  }

  if (chat === null) {
    // chat doesnt exist or user is not apart of this chat
    payload.errorMessage =
      "Chat does not exist or you do not have permission to view it.";
  } else {
    payload.chat = chat;
  }

  // console.log(payload);
  res.status(200).render("chat", payload);
});

const getChatByUserId = (userLoggedInId, otherUserId) => {
  // size of array must be 2,
  // $all of conditions are met
  // one is userloggedin req.session.user
  // other one is also apart of the array
  return Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          { $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId) } },
          { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } },
        ],
      },
    },
    {
      // if nothing exists, create it here
      $setOnInsert: { users: [userLoggedInId, otherUserId] },
    },
    { new: true, upsert: true }
  ).populate("users", "-password");
};

module.exports = router;
