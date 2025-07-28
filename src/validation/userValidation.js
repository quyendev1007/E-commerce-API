import Joi from "joi";

export const authSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().optional(),
  phone: Joi.string().optional(),
});
