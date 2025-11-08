import { Router } from "express";
import auth from "../../middleware/auth";
import { productControllers } from "./product.controller";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/uploadFile";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";
const router = Router();

router.post("/category/create", auth(Role.ADMIN), productControllers.createCategoryController);
router.get("/category/list", productControllers.getCategoriesController);
router.delete("/category/delete/:categoryId", auth(Role.ADMIN), productControllers.deleteCategoryController);

router.post("/create", auth(Role.ADMIN), fileUploader.uploadImages,parseBodyMiddleware, productControllers.createProductController);
router.put("/update/:productId", auth(Role.ADMIN), fileUploader.uploadImages,parseBodyMiddleware, productControllers.updateProductController);
router.get("/list", productControllers.getProductsController);
router.get("/details/:productId", productControllers.getProductDetailsController);
router.delete("/delete/:productId", auth(Role.ADMIN), productControllers.deleteProductController);
router.get("/related/:productId", productControllers.getRelatedProductsController);
router.get("/tags", productControllers.getAllCommonTagsController);
router.get("/best-selling", productControllers.getBestSellingProductsController);

// global image uploader
router.post("/upload", fileUploader.specImage,parseBodyMiddleware, productControllers.uploadProductImageController);


export const productRoutes = router;