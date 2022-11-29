const { ERROR_500_MESSAGE } = require('../Utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? ERROR_500_MESSAGE
        : message,
    });
  next();
};

module.exports = errorHandler;
