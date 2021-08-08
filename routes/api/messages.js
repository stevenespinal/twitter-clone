const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");
const Chat = require("../../models/Chat");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

router.post("/", async (req, res, next) => {
  try {
    if (!req.body.content || !req.body.chatId) {
      console.log("invalid data");
      return res.sendStatus(400);
    }
    let newMessage = {
      sender: req.session.user._id,
      content: req.body.content,
      chat: req.body.chatId,
    };

    let msg = await Message.create(newMessage);
    await msg.populate("sender").execPopulate();
    await msg.populate("chat").execPopulate();
    await User.populate(msg, { path: "chat.users" });
    let chat = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: msg,
    });

    insertNotifications(chat, msg);

    res.status(201).send(msg);
  } catch (error) {
    console.error(error);
    // res.sendStatus(400);
  }
});

// router.get("/", async (req, res, next) => {});

const insertNotifications = (chat, message) => {
  chat.users.forEach((userId) => {
    if (userId == message.sender._id.toString()) return;
    Notification.insertNotification(
      userId,
      message.sender._id,
      "newMessage",
      message.chat._id
    );
  });
};

module.exports = router;
