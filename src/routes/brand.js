import { Router } from "express";
import { brandController } from "./../controllers/brand";
import { validateRequest } from "../middlewares/validateRequest";
import { brandSchema } from "./../validation/brandValidation";

const brand = Router();

brand
  .route("/")
  .get(brandController.getBrands)
  .post(validateRequest(brandSchema), brandController.createBrand);

brand
  .route("/:id")
  .get(brandController.getBrandById)
  .put(brandController.updateBrand)
  .delete(brandController.deleteBrand);

export default brand;
