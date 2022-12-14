require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const celebrate = require('celebrate'); // проверка валидности ссылок и email
const { cors } = require('./middlewares/cors');
const indexRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');

const { NODE_ENV, MONGO_URL_PROD } = process.env;
const { MONGO_URL_DEV } = require('./Utils/constants');

const { PORT = 3000, MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : MONGO_URL_DEV } = process.env;

const app = express();
app.use(cors);
app.use(requestLogger); // логер запросов
app.use(helmet()); //
app.use(cookieParser()); // анализирует файлЫ cookie, прикрепленных к запросу
app.use(express.json()); // анализирует входящие запросы с полезной нагрузкой JSON
app.use(express.urlencoded({ extended: true })); // переназначает символы которые могут нанести вред
app.use(rateLimiter);
mongoose.connect(MONGO_URL); // подключение к БД
app.use(indexRouter); // роуты
app.use(errorLogger); // логер ошибок
app.use(celebrate.errors()); // обработчик ошибок валидации ссылок и почты из middleware/validation

app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту: ${PORT} `);
});
