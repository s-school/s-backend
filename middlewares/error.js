const winston = require("winston");

// This handles the uncaught errors inside the request procesing pipeline
module.exports = function(err, req, res, next) {
  // Log the exception
  // this order matters
  // error, warn, info, verbose, debug, silly
  winston.error(err.message, err);

  res.status(500).send("Something went wrong !");
};
