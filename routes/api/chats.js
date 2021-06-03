const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");

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

module.exports = router;
