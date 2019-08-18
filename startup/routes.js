// const morgan = require("morgan");
// const debug = require("debug")("app:startup"); // need to set the DEBUG env variable to  app:startup
const express = require("express");
const fileUpload = require("express-fileupload");

const error = require("../middlewares/error");

const home = require("../routes/home");
const courses = require("../routes/courses");
const announcements = require("../routes/announcements");
const students = require("../routes/students");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(fileUpload());

  app.use("/", home);
  app.use("/api/courses", courses);
  app.use("/api/announcements", announcements);
  app.use("/api/students", students);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);
};
