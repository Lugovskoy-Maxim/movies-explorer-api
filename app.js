const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { PORT = 3000, MANGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env; // localhost - выдеат ошибку на рабочем пк (дома проверить )

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(MANGO_URL);

app.use('/*', () => { throw new Error('404 page not found'); }); // при переходе на несуществующий адрес
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
