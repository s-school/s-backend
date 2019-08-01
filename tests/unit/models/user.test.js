const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("generateAuthToken", () => {
  it("Should return a valid JWT token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: "Amine",
      email: "A@gmail.com",
      roles: ["admin"],
      password: "123456"
    };

    const user = new User(payload);

    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(decoded).toMatchObject({ _id: payload._id, roles: payload.roles });
  });
});
