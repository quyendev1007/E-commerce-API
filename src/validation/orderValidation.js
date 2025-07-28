import Joi from "joi";

export const orderSchema = Joi.object({
  user_id: Joi.string().required(),
  note: Joi.string().optional(),
  total: Joi.number().required(),
  products: Joi.array().required(),
});
