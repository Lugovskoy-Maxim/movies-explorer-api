const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const celebrate = require('celebrate'); // проверка валидности ссылок и email
const { cors } = require('./middlewares/cors');
const indexRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env; // localhost - выдеат ошибку на рабочем пк (дома проверить ) вынести url в .env

const app = express();
app.use(cors);
app.use(requestLogger);
app.use(helmet());
app.use(cookieParser()); // анализирует файлЫ cookie, прикрепленных к запросу
app.use(express.json()); // анализирует входящие запросы с полезной нагрузкой JSON
app.use(express.urlencoded({ extended: true })); // переназначает символы которые могут нанести вред
mongoose.connect(MANGO_URL);

app.use(indexRouter);

app.use(errorLogger);
app.use(celebrate.errors()); // обработчик ошибок валидации ссылок и почты из middleware/validation

app.use((err, req, res, next) => { // центролизованный обработчик ошибок (нужно вынести)
  const { statusCode, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту: ${PORT} `);
});
