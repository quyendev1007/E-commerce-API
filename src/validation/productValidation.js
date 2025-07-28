import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  old_price: Joi.number().optional(),
  description: Joi.string(),
  image: Joi.string().optional(),
  quantity: Joi.number().required(),
  brand_id: Joi.string(),
  category_id: Joi.string(),
});
