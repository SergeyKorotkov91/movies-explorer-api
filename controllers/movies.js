const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundErrors');
const BadRequest = require('../errors/badRequest');
const ForbiddenError = require('../errors/forbiddenError');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user.id
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { filmId } = req.params;

  Movie.findById(filmId)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным _id не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user.id) {
        throw new ForbiddenError('В доступе отказано');
      }
      return Movie.findByIdAndRemove(filmId).then(() => res.status(200).send({ message: 'Кино удалено' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
