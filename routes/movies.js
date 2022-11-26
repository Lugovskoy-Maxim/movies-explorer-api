const router = require('express').Router();
const { validateCreateMovies, validateMoviesId } = require('../middlewares/validation');

const {
  createMovies, removeMovies, getMovies,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.patch('/movies', validateCreateMovies, createMovies);
router.patch('/movies/:id', validateMoviesId, removeMovies);

module.exports = router;
