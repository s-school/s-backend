const jwt = require("jsonwebtoken");
const validateBody = require("../middlewares/validateBody");

const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const config = require("config");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

// Login route
router.post("/", validateBody(validate), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordValid) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;
