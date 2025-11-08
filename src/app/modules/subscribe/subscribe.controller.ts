import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscribeServices } from "./subscribe.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../middleware/sendResponse";

const createSubscribeController = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body
    const result = await SubscribeServices.createSubscribe(email)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Subscribed successfully", data: result, success: true })
})

const getSubscribedUserListController = catchAsync(async (req: Request, res: Response) => {
    const { page, limit } = req.query as any
    const result = await SubscribeServices.getSubscribedUserList(Number(page) || 1, Number(limit) || 10)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Subscribed user list retrieved successfully", data: result, success: true })
})

export const subscribeControllers = {
    createSubscribeController,
    getSubscribedUserListController
}