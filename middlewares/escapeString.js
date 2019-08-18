const escapeStringRegexp = require("escape-string-regexp");

module.exports = function(req, res, next) {
  const name = req.params.name;

  if (name.length < 2) res.status(400).send("name's length must be at least 2");

  req.params.name = escapeStringRegexp(name);
  next();
};
