import Joi from 'joi';

export const emailSchema = Joi.string()
  .required()
  .email()
  .pattern(/^[a-zA-Z0-9._-]{2,42}@[a-zA-Z0-9-]{2,15}\.[a-zA-Z]{2,15}$/);

export const nameSchema = Joi.string()
  .required()
  .pattern(/^[a-zA-Zа-яА-ЯёЁ\d\s-]{2,30}$/);

export const passwordSchema = Joi.string()
  .required()
  .pattern(/^[a-zA-Z0-9]{8,24}$/);
