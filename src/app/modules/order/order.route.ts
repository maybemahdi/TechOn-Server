import { Router } from "express";

import { orderControllers } from "./order.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/create", auth(Role.USER), orderControllers.createOrderFromCartController);
router.get("/me", auth(Role.USER), orderControllers.getMyOrdersController);
router.get("/details/:orderId", auth(Role.USER, Role.ADMIN), orderControllers.getOrderDetailsController);
router.get("/all", auth(Role.ADMIN), orderControllers.getAllOrdersController);
router.put("/update/:orderId", auth(Role.ADMIN), orderControllers.updateOrderStatusController);
router.get("/overview", auth(Role.ADMIN), orderControllers.overViewController);
router.post("/single", auth(Role.USER), orderControllers.createSingleOrderController);

export const orderRoutes = router;