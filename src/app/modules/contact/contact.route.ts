import { Router } from "express";
import { contactController } from "./contact.controller";

const router = Router();

router.post("/", contactController.createContactController);

export const contactRoutes = router