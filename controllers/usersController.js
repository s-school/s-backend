const { User } = require("../models/user");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = await User.create(_.pick(req.body, ["email", "password", "roles"]));

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
};

module.exports._read = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};
