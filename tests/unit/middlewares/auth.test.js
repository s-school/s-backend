const auth = require("../../../middlewares/auth");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("Auth middleware", () => {
  test("should set req.user to token's user", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: "Amine",
      email: "A@gmail.com",
      password: "123456789",
      roles: ["teacher"]
    };
    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token)
    };

    let next = jest.fn();
    let res = {};

    auth(req, res, next);

    expect(req.user).toMatchObject({
      _id: user._id,
      roles: user.roles
    });
  });
});
