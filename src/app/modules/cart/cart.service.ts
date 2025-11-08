// // services/cartService.ts
// import { PrismaClient } from "@prisma/client";
// import ApiError from "../../error/ApiErrors";
// import { StatusCodes } from "http-status-codes";
// const prisma = new PrismaClient();

// const addToCart = async (userId: string, productId: string, quantity: number) => {
//     // Find or create user cart
//     let cart = await prisma.cart.findUnique({ where: { userId } });
//     if (!cart) {
//         cart = await prisma.cart.create({ data: { userId } });
//     }

//     // Check if product already exists in cart
//     const existingItem = await prisma.cartItem.findFirst({
//         where: { cartId: cart.id, productId },
//         include: {
//             product: true
//         }
//     });

//     if (existingItem) {
//         return prisma.cartItem.update({
//             where: { id: existingItem.id },
//             data: { quantity: quantity, subTotal: quantity * existingItem.product.price },
//         });
//     } else {
//         const product = await prisma.product.findUnique({ where: { id: productId } });
//         if (!product) {
//             throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
//         }
//         return prisma.cartItem.create({
//             data: {
//                 cartId: cart.id,
//                 productId,
//                 quantity,
//                 subTotal: quantity * product.priceStorage[0].price
//             },
//         });
//     }
// };

// const getCart = async (userId: string) => {
//     return prisma.cart.findUnique({
//         where: { userId },
//         select: {
//             id: true,
//             items: {
//                 select: {
//                     id: true,
//                     quantity: true,
//                     subTotal: true,
//                     product: {
//                         select: {
//                             name: true,
//                             priceStorage: true,
//                             images: true
//                         }
//                     }
//                 },

//             },
//         },
//     });
// };

// const removeFromCart = async (cartId: string, cartItemId: string) => {
//     const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId, cartId } });
//     if (!cartItem) {
//         throw new ApiError(StatusCodes.NOT_FOUND, "Cart item not found");
//     }
//     return prisma.cartItem.delete({ where: { id: cartItemId, cartId } });
// };


// export const cartServices = {
//     addToCart,
//     getCart,
//     removeFromCart,
// };