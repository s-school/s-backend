const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
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
        console.log(r);
        return r && r.length > 0;
      },
      message: "User roles not provided"
    }
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, roles: this.roles },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
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

exports.User = User;
exports.validate = validateUser;
