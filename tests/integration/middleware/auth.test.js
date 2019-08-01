const request = require("supertest");
const { Course } = require("../../../models/course");
const { User } = require("../../../models/user");

let server;

describe("Auth middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
    await Course.deleteMany({});
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/courses")
      .set("x-auth-token", token)
      .send({ name: "Algorithm" });
  };

  beforeEach(() => {
    token = new User({
      name: "Amine",
      email: "B@gmail.com",
      password: "123456789",
      roles: ["teacher"]
    }).generateAuthToken();
  });

  test("should return status 401 if token is empty", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  test("should return status 400 if token is invalid", async () => {
    token = "aaa";

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
