const mongoose = require("mongoose");
const Joi = require("joi");

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    }
  })
);

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
  };

  return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validate = validateCourse;
