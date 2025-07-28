import { Router } from "express";
import { orderDetailController } from "./../controllers/orderDetail";
import { validateRequest } from "../middlewares/validateRequest";
import { orderDetailSchema } from "./../validation/orderDetailvalidation";

const orderDetail = Router();

orderDetail
  .route("/")
  .get(orderDetailController.getOrderDetails)
  .post(
    validateRequest(orderDetailSchema),
    orderDetailController.createOrderDetail
  );

orderDetail
  .route("/:id")
  .get(orderDetailController.getOrderDetailById)
  .put(orderDetailController.updateOrderDetail)
  .delete(orderDetailController.deleteOrderDetail);

export default orderDetail;
