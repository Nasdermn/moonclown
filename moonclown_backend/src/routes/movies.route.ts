import { Router } from 'express';
import moviesController from '../controllers/movies.controller';
import { movieByIdValidation } from '../middlewares/validate.middleware';

const moviesRouter = Router();

moviesRouter.get('', moviesController.getMovies);
moviesRouter.post('', moviesController.createMovie);
moviesRouter.delete('/:id', movieByIdValidation, moviesController.removeMovie);

export default moviesRouter;
