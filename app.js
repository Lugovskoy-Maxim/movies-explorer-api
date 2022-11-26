const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const celebrate = require('celebrate'); // проверка валидности ссылок и email
const auth = require('./middlewares/auth');
const routesUser = require('./routes/users');
const NotFoundError = require('./errors/NotFoundError');
const { registrations, login } = require('./controllers/users');
const { validateLogin, validateRegisterations } = require('./middlewares/validation');
// const routesMovies = require('./routes/movies');

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env; // localhost - выдеат ошибку на рабочем пк (дома проверить ) вынести url в .env

const app = express();
app.use(helmet());
app.use(cookieParser()); // анализирует файлЫ cookie, прикрепленных к запросу
app.use(express.json()); // анализирует входящие запросы с полезной нагрузкой JSON
app.use(express.urlencoded({ extended: true })); // переназначает символы которые могут нанести вред
mongoose.connect(MANGO_URL);

app.use('/signin', validateLogin, login);
app.use('/signup', validateRegisterations, registrations);

app.use(auth);

app.get('/signout', (req, res) => {
  res.clearCookie('jwtToken').send({ message: 'Выход' });
});
app.use(routesUser);

app.use('/*', () => { throw new NotFoundError('Запрашиваемая страница не найдена'); }); // при переходе на несуществующий адрес
app.use(celebrate.errors()); // обработчик ошибок валидации ссылок и почты из middleware/validation

// app.use(routesMovie);
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

app.listen(PORT, () => { // удалить или закоментить консоль после деплося
  console.log(`Приложение запущено на порту: ${PORT} `);
});
