const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const usersController = require('../controllers/users');
const mailerController = require('../controllers/mailer');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/NotFoundError');
const {
  signinValidation,
  signupValidation,
  emailValidation,
  checkCodeValidation,
} = require('../middlewares/validate');

router.post('/signup', signupValidation, usersController.registerUser);
router.post('/signin', signinValidation, usersController.loginUser);
router.post('/getcode', emailValidation, mailerController.sendCode);
router.post('/checkcode', checkCodeValidation, mailerController.compareCode);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => next(new NotFoundError('По указанному вами адресу страница не найдена')));

module.exports = router;
