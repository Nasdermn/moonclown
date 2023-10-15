const router = require('express').Router();
const moviesController = require('../controllers/movies');
const {
  movieByIdValidation,
  movieValidation,
} = require('../middlewares/validate');

router.get('', moviesController.getMovies);
router.post('', movieValidation, moviesController.createMovie);
router.delete('/:id', movieByIdValidation, moviesController.removeMovie);

module.exports = router;
