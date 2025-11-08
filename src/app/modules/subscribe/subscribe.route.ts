import { Router } from "express";

import { subscribeControllers } from "./subscribe.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/create", subscribeControllers.createSubscribeController);
router.get("/list", auth(Role.ADMIN), subscribeControllers.getSubscribedUserListController);

export const subscribeRoutes = router;