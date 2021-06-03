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
const postsApi = require("./routes/api/posts");
const chatsApi = require("./routes/api/chats");
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
app.use("/post", requireLogin, postRoutes);
app.use("/profile", requireLogin, profileRoutes);
app.use("/uploads", uploadRoutes);

// listen to server
app.listen(PORT, () => console.log(`Running app on port ${PORT}`));
