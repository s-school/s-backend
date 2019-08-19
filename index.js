const winston = require("winston");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static(""));

require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/prod")(app);

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   debug("Morgan enabled...");
// }

const port = process.env.PORT || 4002;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
