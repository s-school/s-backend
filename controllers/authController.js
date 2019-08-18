const { User } = require("../models/user");
const bcrypt = require("bcrypt");

module.exports._authenticate = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordValid) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
};
