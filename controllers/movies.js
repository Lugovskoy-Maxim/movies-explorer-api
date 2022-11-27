const Movie = require('../models/movies');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenErrors,
} = require('../errors/index');
const {
  ERROR_400_MESSAGE,
  ERROR_404_MOVIE_MESSAGE,
  ERROR_403_MESSAGE,
  REMOVE_SUCCESSFULLY_MESSAGE,
} = require('../Utils/constants');

module.exports.createMovies = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movies) => res.status(201).send(movies))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports.removeMovies = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError(ERROR_404_MOVIE_MESSAGE))
    .then((movie) => {
      const newLocalOwner = movie.owner.toString() === req.user._id;
      if (newLocalOwner) {
        return movie.remove()
          .then(() => res.send({ message: REMOVE_SUCCESSFULLY_MESSAGE }));
      }
      throw new ForbiddenErrors(ERROR_403_MESSAGE);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError(ERROR_404_MOVIE_MESSAGE))
    .then((movies) => res.send(movies))
    .catch(next);
};
