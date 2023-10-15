const movieModel = require('../models/movie');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  movieModel
    .find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;
  movieModel
    .create({
      nameRU,
      nameEN,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
    })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Указаны некорректные данные при создании фильма',
        );
      }
      return next(err);
    });
};

const removeMovie = (req, res, next) => {
  movieModel
    .findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('По указанному id фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          'У вас нет прав для удаления чужой карточки с фильмом',
        );
      }
      movieModel
        .findByIdAndRemove(req.params.id)
        .then(() => res.send({ message: 'Карточка с фильмом удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для удаления карточки с фильмом',
        );
      }

      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
