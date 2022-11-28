const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require('../errors/index');

const {
  ERROR_400_MESSAGE,
  ERROR_404_USER_MESSAGE,
  ERROR_404_USER_BAD_ID_MESSAGE,
  ERROR_409_EMAIL_MESSAGE,
  AUTH_SUCCESSFULLY_MESSAGE,
  JWT_DEV,
} = require('../Utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.registrations = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt // хеширую пароль чтобы хранить его в зашифрованном виде
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      name: user.name, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400_MESSAGE));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(ERROR_409_EMAIL_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV, { expiresIn: '7d' });
      res.cookie('jwtToken', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
      }).send({ message: AUTH_SUCCESSFULLY_MESSAGE });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(ERROR_404_USER_MESSAGE))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(ERROR_404_USER_BAD_ID_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400_MESSAGE));
        return;
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError(ERROR_409_EMAIL_MESSAGE));
        return;
      }
      next(err);
    });
};
