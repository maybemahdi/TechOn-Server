import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { OrderServices } from "./order.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import { OrderStatus } from "@prisma/client";

const createOrderFromCartController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const body = req.body
    const result = await OrderServices.createOrderFromCart(userId, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Order created successfully", data: result, success: true })
})

const createSingleOrderController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const body = req.body
    const result = await OrderServices.createSingleOrder(userId, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Order created successfully", data: result, success: true })
})

const getMyOrdersController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const { page, limit } = req.query
    const result = await OrderServices.getMyOrders(userId, Number(page) || 1, Number(limit) || 10)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Orders retrieved successfully", data: result, success: true })
})

const getAllOrdersController = catchAsync(async (req: Request, res: Response) => {
    const status = req.query.status as OrderStatus
    const { page, limit } = req.query
    const result = await OrderServices.getAllOrders(status, Number(page) || 1, Number(limit) || 10)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Orders retrieved successfully", data: result, success: true })
})

const updateOrderStatusController = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params
    const status = req.query.status as OrderStatus
    const result = await OrderServices.updateOrderStatus(orderId, status)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Order updated successfully", data: result, success: true })
})

const getOrderDetailsController = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params
    const result = await OrderServices.getOrderDetails(orderId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Order retrieved successfully", data: result, success: true })
})

const overViewController = catchAsync(async (req: Request, res: Response) => {
    const { year } = req.query
    const result = await OrderServices.overView(Number(year))
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Orders retrieved successfully", data: result, success: true })
})

export const orderControllers = {
    createOrderFromCartController,
    createSingleOrderController,
    getMyOrdersController,
    getAllOrdersController,
    updateOrderStatusController,
    getOrderDetailsController,
    overViewController
}