const auth = require("../middlewares/auth");
const validateBody = require("../middlewares/validateBody");
const role = require("../middlewares/role");
const { Student, validate } = require("../models/student");
const express = require("express");
const router = express.Router();

/*
 * here are defined roles for each route
 * routes that are not listed in the object
 * are accessible for all roles
 */

const roles = {
  post: ["admin"],
  put: ["admin"],
  delete: ["admin"]
};

router.get("/", async (req, res) => {
  const students = await Student.find()
    .populate("courses", "name")
    .sort("class");
  res.send(students);
});

router.get("/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "courses",
      "name"
    );
  } catch (e) {
    next(e);
  }

  if (!student) return res.status(404).send("Student not found");

  res.send(student);
});

router.post(
  "/",
  [auth, role(roles.post), validateBody(validate)],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = new Student(req.body);

    student = await student.save();
    res.send(student);
  }
);

router.put(
  "/:id",
  [auth, role(roles.put), validateBody(validate)],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!student) return res.status(404).send("Student not found");

    res.send(student);
  }
);

router.delete("/:id", [auth, role(roles.delete)], async (req, res) => {
  const student = await Student.findByIdAndRemove(req.params.id);

  if (!student) return res.status(404).send("Student not found");

  res.send(student);
});

module.exports = router;
