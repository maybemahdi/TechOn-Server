import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";

const createSubscribe = async (email: string) => {
    if (!email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
    }
    const findUser = await prisma.subscriptionUser.findUnique({
        where: {
            email
        }
    })
    if (findUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You are already subscribed to our newsletter");
    }
    const result = await prisma.subscriptionUser.create({ data: { email } });
    return result;
}

const getSubscribedUserList = async (page: number, limit: number) => {
    const result = await prisma.subscriptionUser.findMany(
        {
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit
        }
    );

    return {
        meta: {
            page,
            limit,
            total: await prisma.subscriptionUser.count(),
            totalPage: Math.ceil(await prisma.subscriptionUser.count() / limit)
        },
        result  
    }
}

export const SubscribeServices = {
    createSubscribe,
    getSubscribedUserList
}