const request = require("supertest");
const { Course } = require("../../../models/course");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/courses", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
    await Course.deleteMany({});
  });

  describe("GET /", () => {
    test("should return all courses", async () => {
      // populate db
      await Course.insertMany([{ name: "Algorithm" }, { name: "Math" }]);

      // get courses
      const res = await request(server).get("/api/courses");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(c => c.name === "Algorithm")).toBeTruthy();
      expect(res.body.some(c => c.name === "Math")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    test("should return the course corresponding to the id", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();

      // populate db
      await Course.insertMany([{ _id: id, name: "Algorithm" }]);

      // get courses
      const res = await request(server).get(`/api/courses/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toMatch("Algorithm");
    });

    test("should return a 404 error if id is not valid", async () => {
      const insert_id = new mongoose.Types.ObjectId().toHexString();
      const get_id = new mongoose.Types.ObjectId().toHexString();

      // populate db
      await Course.insertMany([{ _id: insert_id, name: "Algorithm" }]);

      // get courses
      const res = await request(server).get(`/api/courses/${get_id}`);

      expect(res.status).toBe(404);
      // expect(res.body.name).toMatch("Algorithm");
    });
  });

  describe("POST /", () => {
    // 2 variables we need for each test
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/api/courses")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User({
        name: "Amine",
        email: "A@gmail.com",
        password: "123456789",
        roles: ["teacher"]
      }).generateAuthToken();
      name = "Algorithm";
    });

    test("should return 401 error if user not authenticated", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test("should return 400 error if course not valid(name length (<3) or (>100) )", async () => {
      name = new Array(102).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test("should save the course if it is valid", async () => {
      const res = await exec();

      const course = await Course.find({ name });

      expect(course).not.toBeNull();
    });

    test("should return the course if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
    });
  });
});
