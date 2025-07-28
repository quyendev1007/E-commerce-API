import { Router } from "express";
import { authController } from "../controllers/user";

const user = Router();

user.route("/").get(authController.getUsers);

user.route("/:id").put(authController.updateUser);

export default user;
