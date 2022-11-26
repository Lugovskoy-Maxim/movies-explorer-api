const Movie = require('../models/movies');
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenErrors = require('../errors/ForbiddenErrors'); // 403

module.exports.createMovies = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movies) => res.status(201).send(movies))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.removeMovies = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      const newLocalOwner = movie.owner.toString() === req.user._id;
      if (newLocalOwner) {
        return movie.remove()
          .then(() => res.send({ message: 'Фильм  успешно удален' }));
      }
      throw new ForbiddenErrors('Невозможно удалить чужой фильм');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError('Фильмы  не найдены'))
    .then((movies) => res.send(movies))
    .catch(next);
};
