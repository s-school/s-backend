const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstname: { type: String, minlength: 2, maxlength: 50 },
  lastname: { type: String, minlength: 2, maxlength: 50 },
  birthdate: Date,
  picture: String,
  courses: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v) {
        const up = v.match(/.*[A-Z]+.*/);
        const low = v.match(/.*[a-z]+.*/);
        const num = v.match(/.*[0-9]+.*/);
        return up && low && num;
      },
      message:
        "Password must contain an uppercase letter, a lowercase letter and a number"
    }
  },
  roles: {
    type: [
      {
        type: String,
        enum: ["admin", "teacher", "student"]
      }
    ],
    required: true,
    validate: {
      validator: function(r) {
        return r && r.length > 0;
      },
      message: "At least 1 user role must be provided"
    }
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, roles: this.roles },
    config.get("jwtPrivateKey")
  );
};

userSchema.statics.create = async function(userInfo) {
  user = new User(userInfo);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  return user.save();
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    firstname: Joi.string()
      .min(2)
      .max(50),
    lastname: Joi.string()
      .min(2)
      .max(50),
    birthdate: Joi.date(),
    picture: Joi.string(),
    courses: Joi.array(),
    email: Joi.string()
      .email()
      .required(),
    roles: Joi.array()
      .min(1)
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  };

  return Joi.validate(user, schema);
}

function validateLogin(loginInfo) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  };

  return Joi.validate(loginInfo, schema);
}

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLogin;
