import { Router } from "express";
import { categoryController } from "./../controllers/category";
import { validateRequest } from "../middlewares/validateRequest";
import { categorySchema } from "./../validation/categoryValidation";

const category = Router();

category
  .route("/")
  .get(categoryController.getCategories)
  .post(validateRequest(categorySchema), categoryController.createCategory);

category
  .route("/:id")
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default category;
