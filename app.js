const express = require("express");
const PORT = 3001;
const { requireLogin } = require("./middleware");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const path = require("path");
const bodyParser = require("body-parser");
const database = require("./database");
const app = express();
const session = require("express-session");
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
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

// home page
app.get("/", requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "Home Page",
    userLoggedIn: req.session.user,
  };
  res.status(200).render("home", payload);
});

// listen to server
app.listen(PORT, () => console.log(`Running app on port ${PORT}`));
