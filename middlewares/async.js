/*
 *   This function wraps all the route handlers in try-catch blocks
 *   to detect internal server errors, like database shutting down...
 *   the express-async-errors calls it automatically .
 */
module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
};
