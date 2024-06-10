import { Request, Response, NextFunction, Router } from 'express';
import authRouter from './auth.route';
import usersRouter from './users.route';
import movieRouter from './movies.route';
import mailRouter from './mail.route';
import passwordRouter from './password.route';
import kinopoiskRouter from './kinopoisk.route';
import { getImage } from '../controllers/image.controller';
import authMiddleware from '../middlewares/auth.middleware';
import NotFoundError from '../utils/errors/NotFoundError';

const router = Router();

router.get('/images/:filename', getImage);

router.use('/auth', authRouter);
router.use('/mail', mailRouter);
router.use('/password', passwordRouter);
router.use('/users', authMiddleware, usersRouter);
router.use('/movies', authMiddleware, movieRouter);
router.use('/kinopoisk', authMiddleware, kinopoiskRouter);

router.use('*', (req: Request, res: Response, next: NextFunction) =>
  next(new NotFoundError('По указанному вами адресу страница не найдена')),
);

export default router;
