const router = require('express').Router();
const { validateCreateMovies, validateMoviesId } = require('../middlewares/validation');

const {
  createMovies, removeMovies, getSavedMovies,
} = require('../controllers/movies');

router.get('/movies', getSavedMovies);
router.patch('/movies', validateCreateMovies, createMovies);
router.delete('/movies/:id', validateMoviesId, removeMovies);

module.exports = router;
