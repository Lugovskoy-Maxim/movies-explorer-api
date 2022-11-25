const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate'); // проверка валидности ссылок и email

const { PORT = 3000, MANGO_URL = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env; // localhost - выдеат ошибку на рабочем пк (дома проверить ) вынести url в .env

const app = express();
app.use(cookieParser()); // анализирует файлЫ cookie, прикрепленных к запросу
app.use(express.json()); // анализирует входящие запросы с полезной нагрузкой JSON
app.use(express.urlencoded({ extended: true })); // переназначает символы которые могут нанести вред
mongoose.connect(MANGO_URL);

app.use('/*', () => { throw new Error('this page not found'); }); // при переходе на несуществующий адрес
app.use(errors); // обработчик ошибок валидации проверки ссылок и почты из middleware/validation
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
  console.log(`Приложение запущено на ${PORT} порту`);
});
