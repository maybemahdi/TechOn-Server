import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";

const createReview = async (userId: string, productId: string, payload: any) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    const review = await prisma.review.findFirst({
        where: {
            userId,
            productId
        }
    })
    if (review) {
        throw new ApiError(400, "You have already reviewed this product")
    }
    const result = await prisma.review.create({
        data: {
            userId,
            productId,
            ...payload
        }
    });
    return result;
};

const getReviews = async (productId: string) => {
    const result = await prisma.review.findMany({
        where: {
            productId
        },
        include: {
            userDetails: {
                select: {
                    name: true,
                    profileImage: true,
                }
            }
        }
    });
    return result;
};

export const reviewServices = {
    createReview,
    getReviews
}