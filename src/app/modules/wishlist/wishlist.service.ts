import { StatusCodes } from "http-status-codes"
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors"

const addToWishlist = async (userId: string, productId: string) => {
    const alreadyExists = await prisma.wishlist.findFirst({
        where: {
            userId,
            productId
        }
    })
    if (alreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "Product already exists in wishlist")
    }
    const result = await prisma.wishlist.create({
        data: {
            userId,
            productId
        }
    })
    return result
}

const getWishlist = async (userId: string) => {
    const result = await prisma.wishlist.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            productDetails: {
                select: {
                    id: true,
                    name: true,
                    priceStorage: true,
                    images: true,
                },
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}

const removeFromWishlist = async (userId: string, productId: string) => {
    const alreadyExists = await prisma.wishlist.findFirst({
        where: {
            userId,
            productId
        }
    })
    if (!alreadyExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found in wishlist")
    }
    const result = await prisma.wishlist.delete({
        where: {
            id: alreadyExists.id
        }
    })
    return result
}

export const wishlistServices = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
}