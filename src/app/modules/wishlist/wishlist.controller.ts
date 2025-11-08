import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { wishlistServices } from "./wishlist.service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"

const addToWishlistController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const { id } = req.user
    const result = await wishlistServices.addToWishlist(id, productId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Product added to wishlist", data: result, success: true })
})

const getWishlistController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await wishlistServices.getWishlist(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Wishlist retrieved successfully", data: result, success: true })
})

const removeFromWishlistController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const { id } = req.user
    const result = await wishlistServices.removeFromWishlist(id, productId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Product removed from wishlist", data: result, success: true })
})

export const wishlistControllers = {
    addToWishlistController,
    getWishlistController,
    removeFromWishlistController
}