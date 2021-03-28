const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;
  var payload = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    username: username.trim(),
    email: email.trim(),
    password,
  };
  console.log(payload);

  if (firstName && lastName && username && email && password) {
    try {
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (!user) {
        // no user found
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
        });

        req.session.user = user;
        return res.redirect("/");
      } else {
        // found user
        if (email === user.email) {
          payload.errorMessage = "Email is already in use.";
        } else {
          payload.errorMessage = "Username is already in use.";
        }
        res.status(200).render("register", payload);
      }
    } catch (error) {
      console.error(error);
      payload.errorMessage = "Something went wrong.";
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure each field is filled out completely";
    res.status(200).render("register", payload);
  }
};

module.exports = { register };
