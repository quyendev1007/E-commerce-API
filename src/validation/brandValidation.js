import Joi from "joi";

export const brandSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().optional(),
});
