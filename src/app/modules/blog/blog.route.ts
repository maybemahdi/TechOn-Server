import { Router } from "express";

import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { blogControllers } from "./blog.controller";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";
import { fileUploader } from "../../helper/uploadFile";

const router = Router();

router.post("/create", auth(Role.ADMIN), fileUploader.uploadBlogImages, parseBodyMiddleware, blogControllers.createBlogController);
router.get("/get/all", blogControllers.getAllBlogsController);
router.get("/details/:blogId", blogControllers.getBlogByIdController);
router.delete("/delete/:blogId", auth(Role.ADMIN), blogControllers.deleteBlogController);

export const blogRoutes = router;