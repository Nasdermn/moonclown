import { celebrate, Joi } from "celebrate";
import { RequestHandler } from "express";
import {
  codeSchema,
  emailSchema,
  messageSchema,
  nameSchema,
  passwordSchema,
} from "../utils/validationSchemas";

export const loginValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const registerValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const nameValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    name: nameSchema,
  }),
});

export const emailValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    email: emailSchema,
  }),
});

export const passwordValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    password: passwordSchema,
  }),
});

export const checkCodeValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    email: emailSchema,
    code: codeSchema,
  }),
});

export const sendMessageValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    name: nameSchema,
    email: emailSchema,
    message: messageSchema,
  }),
});

export const passwordsValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  }),
});

export const movieValidation: RequestHandler = celebrate({
  body: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    year: Joi.number().required(),
    genres: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .required(),
    country: Joi.string().required(),
    movieLength: Joi.number().required(),
    poster: Joi.string().required(),
  }),
});

export const movieByIdValidation: RequestHandler = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});
