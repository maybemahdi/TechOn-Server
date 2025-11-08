import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../middleware/sendResponse";
import { productServices } from "./product.service";
import { StatusCodes } from "http-status-codes";
import { getImageUrl } from "../../helper/uploadFile";

const createCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const name = req.body.name as string;
    const result = await productServices.createCategory(name);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Category created successfully",
      data: result,
      success: true,
    });
  }
);

const getCategoriesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productServices.getCategories();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Categories retrieved successfully",
      data: result,
      success: true,
    });
  }
);

const deleteCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await productServices.deleteCategory(categoryId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Category deleted successfully",
      data: result,
      success: true,
    });
  }
);

const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body as any;
    const files = req.files as any;
    const productImages = files?.["productImages"] || null;
    const result = await productServices.createProduct(body, productImages);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Product created successfully",
      data: result,
      success: true,
    });
  }
);

const updateProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const files = req.files as any;
    const images = files?.["productImages"] || null;
    const body = req.body as any;
    const result = await productServices.updateProduct(productId, body, images);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Product updated successfully",
      data: result,
      success: true,
    });
  }
);

const getProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const { category, page, limit, sortBy, tag, maxPrice, search } = req.query;
    const result = await productServices.getProducts(
      Number(page) || 1,
      Number(limit) || 10,
      category as string,
      sortBy as "l2h" | "h2l" | undefined,
      tag as string,
      Number(maxPrice) || undefined,
      search as string
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Products retrieved successfully",
      data: result,
      success: true,
    });
  }
);

const getProductDetailsController = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await productServices.productDetails(productId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Product retrieved successfully",
      data: result,
      success: true,
    });
  }
);

const deleteProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await productServices.deleteProduct(productId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Product deleted successfully",
      data: result,
      success: true,
    });
  }
);

const getAllCommonTagsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productServices.getAllCommonTags();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Common tags retrieved successfully",
      data: result,
      success: true,
    });
  }
);

const getRelatedProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { page, limit } = req.query;
    const result = await productServices.getRelatedProducts(
      productId,
      Number(page) || 1,
      Number(limit) || 10
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Related products retrieved successfully",
      data: result,
      success: true,
    });
  }
);

const getBestSellingProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await productServices.getBestSellingProducts(
      Number(page) || 1,
      Number(limit) || 10
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Best selling products retrieved successfully",
      data: result,
      success: true,
    });
  }
);

const uploadProductImageController = catchAsync(
  async (req: Request, res: Response) => {
    const file = req.file as any;
    const result = file && (await getImageUrl(file));
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Product image uploaded successfully",
      data: result,
      success: true,
    });
  }
);
export const productControllers = {
  createCategoryController,
  getCategoriesController,
  deleteCategoryController,
  createProductController,
  updateProductController,
  getProductsController,
  getProductDetailsController,
  deleteProductController,
  getAllCommonTagsController,
  getRelatedProductsController,
  getBestSellingProductsController,
  uploadProductImageController,
};
