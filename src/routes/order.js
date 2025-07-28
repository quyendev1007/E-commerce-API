import { Router } from "express";
import { orderController } from "./../controllers/order";
import { validateRequest } from "../middlewares/validateRequest";
import { orderSchema } from "./../validation/orderValidation";

const order = Router();

order
  .route("/")
  .get(orderController.getOrders)
  .post(validateRequest(orderSchema), orderController.createOrder);

order
  .route("/:id")
  .get(orderController.getOrderById)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default order;
