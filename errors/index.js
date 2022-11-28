const NotFoundError = require('./NotFoundError'); // 404
const BadRequestError = require('./BadRequestError'); // 400
const ForbiddenErrors = require('./ForbiddenErrors'); // 403
const ConflictError = require('./ConflictError'); // 409

module.exports = {
  NotFoundError,
  BadRequestError,
  ForbiddenErrors,
  ConflictError,
};
