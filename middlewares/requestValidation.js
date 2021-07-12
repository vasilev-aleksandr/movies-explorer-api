const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidation = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validateMovie = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidation).required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

module.exports = {
  validateMovie,
  validateMovieId,
  validateUserUpdate,
};
