const mongoose = require('mongoose');

const urlValidator = {
  validator(v) {
    return /^https?:\/\/(www\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]{1,}/i.test(v);
  },
  message: (value) => `${value} - некоректный формат ссылки`,
};

const movieSchema = new mongoose.Schema(
  {
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      validate: urlValidator,
      required: true,
    },
    trailerLink: {
      type: String,
      validate: urlValidator,
      required: true,
    },
    thumbnail: {
      type: String,
      validate: urlValidator,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    movieId: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
