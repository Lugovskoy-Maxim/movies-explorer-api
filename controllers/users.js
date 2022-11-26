const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409
const BadRequestError = require('../errors/BadRequestError'); // 400

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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });
      res.cookie('jwtToken', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
      }).send({ message: 'Авторизация пройдена!' }); //
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указаным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан некорректный id'));
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
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Указанный адрес электронной почты уже используется'));
        return;
      }
      next(err);
    });
};
