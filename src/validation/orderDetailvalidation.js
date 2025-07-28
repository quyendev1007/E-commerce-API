import Joi from "joi";

export const orderDetailSchema = Joi.object({
  order_id: Joi.string().required(),
  product_id: Joi.string().required(),
  quantity: Joi.string().optional(),
  price: Joi.number().required(),
});
