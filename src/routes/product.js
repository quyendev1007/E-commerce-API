import { productController } from "../controllers/product";
import { validateRequest } from "../middlewares/validateRequest";
import { productSchema } from "../validation/productValidation";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isAuthenticated } from "../middlewares/authMiddleware";

import { Router } from "express";

const product = Router();

product
  .route("/")
  .get(productController.getProducts)
  .post(validateRequest(productSchema), productController.createProduct);
product
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

export default product;
