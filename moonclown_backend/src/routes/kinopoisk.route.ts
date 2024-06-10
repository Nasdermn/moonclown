import express from 'express';
import kinopoiskController from '../controllers/kinopoisk.controller';

const kinopoiskRouter = express.Router();
kinopoiskRouter.use(express.json());

kinopoiskRouter.post('/', kinopoiskController.getMovies);

export default kinopoiskRouter;
