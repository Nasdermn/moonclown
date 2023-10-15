const router = require('express').Router();
const usersController = require('../controllers/users');
const {
  nameValidation,
  avatarValidation,
  passwordValidation,
} = require('../middlewares/validate');

router.get('/me', usersController.getUser);
router.patch('/me/name', nameValidation, usersController.updateName);
router.patch('/me/avatar', avatarValidation, usersController.updateAvatar);
router.patch('/me/password', passwordValidation, usersController.updatePassword);

module.exports = router;
