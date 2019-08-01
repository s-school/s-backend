const mongoose = require("mongoose");
const Joi = require("joi");

const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birthdate: Date,
    class: { type: String, enum: ["1st year", "2nd year", "3rd year"] },
    courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course"
        }
      ],
      validate: {
        validator: function validate_nb_elements(v) {
          return v && v.length >= 1;
        },
        message: "A student must be enrolled in , at least, 1 course"
      }
    }
  })
);

function validateStudent(student) {
  const schema = {
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    birthdate: Joi.date(),
    class: Joi.string(),
    courses: Joi.array().required()
  };

  return Joi.validate(student, schema);
}

exports.Student = Student;
exports.validate = validateStudent;
