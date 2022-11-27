const ERROR_400_MESSAGE = 'Переданы некорректные данные';
const ERROR_401_MESSAGE = 'Необходима авторизация';
const ERROR_401_BAD_REQ_MESSAGE = 'Неправильные почта или пароль';
const ERROR_403_MESSAGE = 'Недостаточно прав для удаления';
const ERROR_404_PAGE_MESSAGE = 'Запрашиваемая страница не найдена';
const ERROR_404_MOVIE_MESSAGE = 'Фильм не найден';
const ERROR_404_USER_MESSAGE = 'Пользователь не найден';
const ERROR_404_USER_BAD_ID_MESSAGE = 'Передан некорректный id';
const ERROR_409_EMAIL_MESSAGE = 'Указанный адрес электронной почты уже используется';
const BAD_URL_MESSAGE = 'Некоректный формат ссылки';
const BAD_EMAIL_MESSAGE = 'Некоректный формат почты';
const REG_EXP_URL = /^https?:\/\/(www\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]{1,}/i;
const REMOVE_SUCCESSFULLY_MESSAGE = 'Удаление успешно!';
const AUTH_SUCCESSFULLY_MESSAGE = 'Авторизация успешна!';
const MONGO_URL_DEV = 'mongodb://localhost:27017/moviesdb';
const JWT_DEV = 'JWT_DEV';

module.exports = {

  ERROR_400_MESSAGE,
  ERROR_401_MESSAGE,
  ERROR_401_BAD_REQ_MESSAGE,
  ERROR_403_MESSAGE,
  ERROR_404_PAGE_MESSAGE,
  ERROR_404_MOVIE_MESSAGE,
  ERROR_404_USER_MESSAGE,
  ERROR_404_USER_BAD_ID_MESSAGE,
  ERROR_409_EMAIL_MESSAGE,
  REMOVE_SUCCESSFULLY_MESSAGE,
  AUTH_SUCCESSFULLY_MESSAGE,
  REG_EXP_URL,
  MONGO_URL_DEV,
  BAD_URL_MESSAGE,
  BAD_EMAIL_MESSAGE,
  JWT_DEV,
};
