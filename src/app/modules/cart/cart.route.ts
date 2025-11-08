// import { Router } from "express";

// import { cartControllers } from "./cart.controller";
// import auth from "../../middleware/auth";
// import { Role } from "@prisma/client";

// const router = Router();

// router.post("/add/:productId", auth(Role.USER), cartControllers.addToCartController);
// router.get("/get", auth(Role.USER), cartControllers.getCartController);
// router.delete("/remove/:cartItemId", auth(Role.USER), cartControllers.removeFromCartController);

// export const cartRoutes = router;