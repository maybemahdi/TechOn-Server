import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { blogServices } from "./blog.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";

const createBlogController = catchAsync(async (req: Request, res: Response) => {
    const body = req.body as any
    const files = req.files as any
    const result = await blogServices.createBlog(body, files);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Blog created successfully",
        data: result,
    });
});

const getAllBlogsController = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, category } = req.query
    const result = await blogServices.getAllBlogs(Number(page) || 1, Number(limit) || 10, category as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Blogs retrieved successfully",
        data: result,
    });
});

const getBlogByIdController = catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params
    const result = await blogServices.getBlogById(blogId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Blog retrieved successfully",
        data: result,
    });
});

const updateBlogController = catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params
    const body = req.body
    const result = await blogServices.updateBlog(blogId, body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Blog updated successfully",
        data: result,
    });
});

const deleteBlogController = catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params
    const result = await blogServices.deleteBlog(blogId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
});

export const blogControllers = {
    createBlogController,
    getAllBlogsController,
    getBlogByIdController,
    updateBlogController,
    deleteBlogController
}