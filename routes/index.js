const router = require('express').Router();
const auth = require('../middlewares/auth');
const routesUser = require('./users');
const routesMovies = require('./movies');
const { registrations, login } = require('../controllers/users');
const { validateLogin, validateRegisterations } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');
const { ERROR_404_PAGE_MESSAGE } = require('../Utils/constants');

router.use('/signin', validateLogin, login);
router.use('/signup', validateRegisterations, registrations);

router.use(auth);

router.get('/signout', (req, res) => {
  res.clearCookie('jwtToken').send({ message: 'Выход' });
});
router.use(routesUser);
router.use(routesMovies);

router.use('/*', () => { throw new NotFoundError(ERROR_404_PAGE_MESSAGE); }); // при переходе на несуществующий адресc

module.exports = router;
