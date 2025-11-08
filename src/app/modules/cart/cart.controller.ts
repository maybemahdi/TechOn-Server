// import { StatusCodes } from "http-status-codes"
// import catchAsync from "../../../shared/catchAsync"
// import sendResponse from "../../middleware/sendResponse"
// import { cartServices } from "./cart.service"
// import { Request, Response } from "express"

// const addToCartController = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.user.id
//     const productId = req.params.productId
//     const quantity = req.body.quantity as any
//     const result = await cartServices.addToCart(userId, productId, quantity || 1)
//     sendResponse(res, { statusCode: StatusCodes.OK, message: "Product added to cart successfully", data: result, success: true })
// })

// const getCartController = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.user.id
//     const result = await cartServices.getCart(userId)
//     sendResponse(res, { statusCode: StatusCodes.OK, message: "Cart retrieved successfully", data: result, success: true })
// })

// const removeFromCartController = catchAsync(async (req: Request, res: Response) => {
//     const cartId = req.user.cartId
//     const cartItemId = req.params.cartItemId
//     const result = await cartServices.removeFromCart(cartId, cartItemId)
//     sendResponse(res, { statusCode: StatusCodes.OK, message: "Product removed from cart successfully", data: result, success: true })
// })

// export const cartControllers = {
//     addToCartController,
//     getCartController,
//     removeFromCartController
// }