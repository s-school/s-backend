const { Course } = require("../models/course");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const course = await Course.create(req.body.name);
  res.send(course);
};

module.exports._read = async (req, res) => {
  const courses = await Course.find().sort("name");
  res.send(courses);
};

module.exports._read_id = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) return res.status(404).send("Course not found");

  res.send(course);
};

module.exports._read_name = async (req, res) => {
  const searchQuery = new RegExp(`.*${req.params.name}.*`, "i");

  const courses = await Course.find({ name: searchQuery });

  res.send(courses);
};

module.exports._update = async (req, res) => {
  const course = await Course.update(req.params.id, req.body.name);

  if (!course) return res.status(404).send("Course not found");

  res.send(course);
};

module.exports._delete = async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id);

  if (!course) return res.status(404).send("Course not found");

  res.send(course);
};
