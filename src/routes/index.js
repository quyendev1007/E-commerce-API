import { Router } from "express";
import auth from "./auth";
import user from "./user";
import product from "./product";
import order from "./order";
import brand from "./brand";
import category from "./category";
import orderDetail from "./orderDetail";

const router = Router();

router.use("/auth", auth);

router.use("/users", user);

router.use("/products", product);

router.use("/orders", order);

router.use("/order-details", orderDetail);

router.use("/brands", brand);

router.use("/categories", category);

export default router;
