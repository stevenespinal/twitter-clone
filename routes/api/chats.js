const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const User = require("../../models/User");
const Message = require("../../models/Message");

router.post("/", async (req, res, next) => {
  if (!req.body.users) {
    console.log("Users param not sent with id");
    return res.sendStatus(400);
  }

  let users = JSON.parse(req.body.users);

  if (users.length === 0) {
    console.log("Users arr null");
    return res.sendStatus(400);
  }

  users.push(req.session.user);

  let chatData = {
    users,
    isGroupChat: true,
  };

  try {
    let result = await Chat.create(chatData);
    res.status(200).send(result);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.put("/:chatId", async (req, res, next) => {
  try {
    await Chat.findByIdAndUpdate(req.params.chatId, req.body);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // find users in Chat schema, we're checking any element in the array that equals the current logged in users ID
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.session.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
      results = results.filter(
        (r) => !r.latestMessage.readBy.includes(req.session.user._id)
      );
    }

    results = await User.populate(results, { path: "latestMessage.sender" });
    res.status(200).send(results);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.get("/:chatId", async (req, res, next) => {
  try {
    // find users in Chat schema, we're checking any element in the array that equals the current logged in users ID
    const results = await Chat.findOne({
      _id: req.params.chatId,
      users: { $elemMatch: { $eq: req.session.user._id } },
    }).populate("users", "-password");
    res.status(200).send(results);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.get("/:chatId/messages", async (req, res, next) => {
  try {
    // find users in Chat schema, we're checking any element in the array that equals the current logged in users ID
    const results = await Message.find({ chat: req.params.chatId }).populate(
      "sender"
    );
    res.status(200).send(results);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
