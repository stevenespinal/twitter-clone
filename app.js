const express = require("express");
const PORT = 3001;
const loginRoutes = require("./routes/loginRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const registerRoutes = require("./routes/registerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/searchRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const postsApi = require("./routes/api/posts");
const chatsApi = require("./routes/api/chats");
const messagesApi = require("./routes/api/messages");
const path = require("path");
const bodyParser = require("body-parser");
const database = require("./database");
const app = express();
const session = require("express-session");
const { requireLogin } = require("./middleware");
require("dotenv").config();

// connect to mongodb
database();

// template engine to render content (easier to display content from server side)
app.set("view engine", "pug");
app.set("views", "views");

// serve static files within public folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
// routes
app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/search", requireLogin, searchRoutes);
app.use("/messages", requireLogin, messagesRoutes);
app.use("/register", registerRoutes);
app.use("/api/posts", postsApi);
app.use("/api/chats", chatsApi);
app.use("/api/users", userRoutes);
app.use("/api/messages", messagesApi);
app.use("/notifications", requireLogin, notificationRoutes);
app.use("/post", requireLogin, postRoutes);
app.use("/profile", requireLogin, profileRoutes);
app.use("/uploads", uploadRoutes);

// listen to server
const server = app.listen(PORT, () =>
  console.log(`Running app on port ${PORT}`)
);

const io = require("socket.io")(server, { pingTimeout: 60000 });

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    // console.log(userData.firstName);
    // join a chat room -> in this case it will have the name as the user id
    socket.join(userData._id);
    // broadcasting connected, emitting this event
    socket.emit("connected");
  });

  socket.on("join room", (room) => socket.join(room));
  // anyone in this specific chatId(room) will be emitted typing indication
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) return console.log("Chat.users not defined");
    chat.users.forEach((user) => {
      // don't broadcast your own message sent to your own account
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
});
