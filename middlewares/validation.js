const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL } = require('validator');

const urlValidator = Joi.string().required().custom((value) => {
  if (!isURL(value)) throw new CelebrateError('Некорректная ссылка на изображение');
  return value;
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateRegisterations = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(), // Обязательное поле-строка от 2 до 30 символов
    email: Joi.string().email().required(),
  }),
});

const validateCreateMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(), // страна создания фильма. Обязательное поле-строка.
    director: Joi.string().required(), // режиссёр фильма. Обязательное поле-строка.
    duration: Joi.number().required(), // длительность фильма. Обязательное поле-число.
    year: Joi.string().required(), // год выпуска фильма. Обязательное поле-строка.
    description: Joi.string().required(), // описание фильма. Обязательное поле-строка.
    image: urlValidator, // ссылка на постер. Обязательное поле-строка. URL-адрес
    trailerLink: urlValidator, // ссылка на трейлер. Обязательное поле-строка. URL-адрес
    thumbnail: urlValidator, // мальенькое изображение Обязательное поле-строка URL-адрес
    movieId: Joi.string().required(), // id фильма, из ответа от MoviesExplorer. Обязательное поле.
    nameRU: Joi.string().required(), // название фильма на рус языке. Обязательное поле-строка.
    nameEN: Joi.string().required(), // название фильма на анг языке. Обязательное поле-строка.
  }),
});

const validateMoviesId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateLogin,
  validateCreateMovies,
  validateUserInfo,
  validateRegisterations,
  validateMoviesId,

};
