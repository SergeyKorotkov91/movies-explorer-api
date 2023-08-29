const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:filmId', validationDeleteMovie, deleteMovie);

module.exports = router;