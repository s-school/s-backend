const mongoose = require("mongoose");
const Joi = require("joi");

let courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  }
});

courseSchema.statics.create = function(name) {
  let course = new Course({ name });
  return course.save();
};

courseSchema.statics.update = function(id, name) {
  return Course.findByIdAndUpdate(id, { name }, { new: true });
};

const Course = mongoose.model("Course", courseSchema);

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
