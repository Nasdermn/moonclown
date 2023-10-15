require('dotenv').config();
const nodemailer = require('nodemailer');
const codeModel = require('../models/code');
const userModel = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const GoneError = require('../utils/errors/GoneError');
const ConflictError = require('../utils/errors/ConflictError');

const { CONFIRMMAIL, MAILPASSWORD } = process.env;

function generateRandomCode() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const paddedCode = randomNumber.toString().padStart(6, '0');
  return paddedCode;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIRMMAIL,
    pass: MAILPASSWORD,
  },
});

// eslint-disable-next-line consistent-return
const sendCode = async (req, res, next) => {
  const userEmail = req.body.email;
  const isUserAlreadyExists = await userModel.findOne({ email: userEmail });
  if (!isUserAlreadyExists) {
    try {
      // Перед генерацией нового кода, удаляем все записи с тем же email
      await codeModel.deleteMany({ email: userEmail });
      const code = generateRandomCode();
      await codeModel.create({ email: userEmail, code });
      await transporter.sendMail({
        from: CONFIRMMAIL,
        to: userEmail,
        subject:
          'Подтвердите регистрацию на сайте films.nasdermn.nomoreparties.sbs',
        text: `Скопируйте в поле ввода на сайте следующий код: ${code}`,
      });
      res.status(200).json({ message: 'Код подтверждения отправлен на указанную почту.' });
    } catch (error) {
      next(error);
    }
  } else {
    return next(
      new ConflictError(
        'Указанный email уже используется другим пользователем. Пожалуйста, введите другую почту.',
      ),
    );
  }
};

const compareCode = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    // Ищем запись в коллекции по email и коду
    const results = await codeModel.find({ email }).sort({ createdAt: -1 }).select('+code');
    if (results.length === 0) {
      // Если запись не найдена, код подтверждения уже истек
      return next(
        new GoneError(
          'Код подтверждения уже истек. Вернитесь назад и получите новый код.',
        ),
      );
    }

    if (results[0].code === code) {
      await codeModel.deleteMany({ email: req.body.email });
      return res.status(200).send({ status: 200, message: 'Коды совпали.' });
    }
    return next(
      new BadRequestError(
        'Код подтверждения неверный. Вы можете попробовать ввести новый код через 5 секунд.',
      ),
    );
  } catch (error) {
    next(error);
  }
  return null;
};

module.exports = {
  sendCode,
  compareCode,
};
