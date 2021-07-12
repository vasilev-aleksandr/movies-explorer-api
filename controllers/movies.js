const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  const id = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: id,
  })
    .then((movie) => {
      res.status(201).send({ data: movie });
    })
    .catch((err) => {
      if (err && err.name === 'ValidationError') {
        throw new BadRequestError(`Указаны некорректные данные при создании фильма: ${err.message}`);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с указанным _id не найден: ${req.params.cardId}`);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Доступ запрещен');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((data) => res.status(200)
          .send(data));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Некорректная информация'));
      } else {
        next(err);
      }
    });
};
