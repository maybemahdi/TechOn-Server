import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";


const createUserController = catchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const result = await userServices.createUserIntoDB(body)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Please check your email for verification", data: result, success: true })
})


const changePasswordController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const body = req.body as any
    const result = await userServices.changePasswordIntoDB(id, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User updated successfully", data: result, success: true })
})

const updateUserController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const body = req?.body as any
    const profileImage = req?.file as any
    const result = await userServices.updateUserIntoDB(id, body, profileImage)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User updated successfully", data: result, success: true })
})

const getMyProfileController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await userServices.getMyProfile(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User profile retrieved successfully", data: result, success: true })
})

const getAllUsersController = catchAsync(async (req: Request, res: Response) => {
    const {page,limit,search,role} = req.query
    const result = await userServices.getAllUsers(Number(page)||1,Number(limit)||10,search as string)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "All users retrieved successfully", data: result, success: true })
})

const changeUserStatusController = catchAsync(async (req: Request, res: Response) => {
    const { userId, status } = req.body
    const result = await userServices.changeUserStatus(userId, status)
    if (status === "ACTIVE") {
        sendResponse(res, { statusCode: StatusCodes.OK, message: "User activated successfully", data: result, success: true })
    }
    if (status === "BLOCKED") {
        sendResponse(res, { statusCode: StatusCodes.OK, message: "User blocked successfully", data: result, success: true })
    }
})

export const userController = {
    createUserController,
    updateUserController,
    changePasswordController,
    getMyProfileController,
    getAllUsersController,
    changeUserStatusController
}