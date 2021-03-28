const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const { register } = require("../controllers/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});

router.post("/", register);

module.exports = router;
