const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { Course, validate } = require("../models/course");
const express = require("express");
const router = express.Router();

/*
 * here are defined roles for each route
 * routes that are not listed in the object
 * are accessible for all roles
 */
const roles = {
  post: ["teacher", "admin"],
  put: ["teacher", "admin"],
  delete: ["teacher", "admin"]
};

router.get("/", async (req, res, next) => {
  const courses = await Course.find().sort("name");
  res.send(courses);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) return res.status(404).send("Course not found");

  res.send(course);
});

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to have a valid request body
 */
router.post(
  "/",
  [auth, role(roles.post), validateBody(validate)],
  async (req, res) => {
    let course = new Course({
      name: req.body.name,
      students: req.body.students
    });

    course = await course.save();
    res.send(course);
  }
);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 * 4. to have a valid request body
 */
router.put(
  "/:id",
  [auth, role(roles.put), validateObjectId, validateBody(validate)],
  async (req, res) => {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      { new: true }
    );

    if (!course) return res.status(404).send("Course not found");

    res.send(course);
  }
);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 */
router.delete(
  "/:id",
  [auth, role(roles.delete), validateObjectId],
  async (req, res) => {
    const course = await Course.findByIdAndRemove(req.params.id);

    if (!course) return res.status(404).send("Course not found");

    res.send(course);
  }
);

module.exports = router;
