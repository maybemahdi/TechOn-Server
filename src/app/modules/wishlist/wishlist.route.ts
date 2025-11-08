import { Router } from "express";

import { wishlistControllers } from "./wishlist.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/add/:productId", auth(Role.USER), wishlistControllers.addToWishlistController);
router.get("/all", auth(Role.USER), wishlistControllers.getWishlistController);
router.delete("/remove/:productId", auth(Role.USER), wishlistControllers.removeFromWishlistController);

export const wishlistRoutes = router;