import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/uploadFile";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";

const route = Router()

route.post('/create', userController.createUserController)

route.put('/change-password', auth(Role.USER || Role.ADMIN), userController.changePasswordController)

route.put("/update", auth(Role.USER || Role.ADMIN), fileUploader.uploadProfileImage, parseBodyMiddleware, userController.updateUserController)
route.get("/me", auth(), userController.getMyProfileController)
route.get("/all", auth(Role.ADMIN), userController.getAllUsersController)
route.put("/status", auth(Role.ADMIN),userController.changeUserStatusController)

export const userRoutes = route