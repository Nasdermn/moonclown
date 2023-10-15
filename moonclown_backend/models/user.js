const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail],
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  avatar: {
    type: String,
    validate: [isURL],
    minlength: 10,
    default:
      'https://i.ytimg.com/vi/9HkTFr2utWk/maxresdefault.jpg',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Email или пароль неверный(е). Попробуйте снова через 5 секунд.');
    })
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Email или пароль неверный(е). Попробуйте снова через 5 секунд.'),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Email или пароль неверный(е). Попробуйте снова через 5 секунд.'),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
