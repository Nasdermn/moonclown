import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      message === "Validation failed"
        ? "Введённый email не проходит валидацию. Проверьте, пожалуйста, правильность ввода."
        : statusCode === 500
        ? `Ошибка сервера : ${message}`
        : message,
  });
};

export default errorHandler;
