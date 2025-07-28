import { validateRequest } from "../middlewares/validateRequest";

import { Router } from "express";
import { authController } from "../controllers/user";
import { authSchema } from "../validation/userValidation";

const auth = Router();

auth
  .route("/register")
  .post(validateRequest(authSchema), authController.register);

auth.route("/login").post(authController.login);

auth.route("/refresh-token", authController.refreshToken);

export default auth;
