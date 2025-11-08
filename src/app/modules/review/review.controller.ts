import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { reviewServices } from "./review.service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"

const createReviewController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const productId = req.params.productId
    const body = req.body
    const result = await reviewServices.createReview(userId, productId, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Review created successfully", data: result, success: true })
})

const getReviewsController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const result = await reviewServices.getReviews(productId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Reviews retrieved successfully", data: result, success: true })
})

export const reviewControllers = {
    createReviewController,
    getReviewsController
}