import { Router } from "express";

import { reviewControllers } from "./review.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/create/:productId", auth(Role.USER), reviewControllers.createReviewController);
router.get("/get/:productId", auth(), reviewControllers.getReviewsController);

export const reviewRoutes = router;