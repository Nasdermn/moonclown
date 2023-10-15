const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/constants');

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(24).required(),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(24).required(),
  }),
});

const nameValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
  }),
});

const emailValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
});

const checkCodeValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    code: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
  }),
});

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(10).regex(urlRegex).required(),
  }),
});

const passwordValidation = celebrate({
  body: Joi.object().keys({
    oldPassword: Joi.string().min(8).max(24).required(),
    newPassword: Joi.string().min(8).max(24).required(),
  }),
});

const movieValidation = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlRegex),
    trailerLink: Joi.string().required().regex(urlRegex),
    thumbnail: Joi.string().required().regex(urlRegex),
    movieId: Joi.number().required(),
  }),
});

const movieByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  signinValidation,
  signupValidation,
  nameValidation,
  emailValidation,
  checkCodeValidation,
  avatarValidation,
  passwordValidation,
  movieValidation,
  movieByIdValidation,
};
