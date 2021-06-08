const User = require("../models/User");
const bcrypt = require("bcrypt");

const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  var payload = req.body;

  if (username && password) {
    try {
      var user = await User.findOne({
        $or: [{ username }, { email: username }],
      });
    } catch (error) {
      console.error(error);
      payload.errorMessage = "Something went wrong.";
      res.status(200).render("login", payload);
    }

    if (user) {
      let result = await bcrypt.compare(password, user.password);

      if (result) {
        user.password = undefined;
        req.session.user = user;
        return res.redirect("/");
      }
    }
    payload.errorMessage = "Incorrect credentials.";
    return res.status(200).render("login", payload);
  }
  payload.errorMessage = "Make sure each field is filled out completely.";
  res.status(200).render("login", payload);
};

module.exports = { signIn };
