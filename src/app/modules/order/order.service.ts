import { PrismaClient, OrderStatus, PaymentMethod } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import { sendOrderConfirmation } from "../../helper/sendOrderConfiemation";
import config from "../../../config";
const prisma = new PrismaClient();

const createOrderFromCart = async (userId: string, payload: { products: any[], paymentMethod: PaymentMethod, billingDetails: any }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: payload.products.map((item) => item.id),
            },
        },
    });


    let total = 0;
    const orderItems = payload.products.map((item) => {
        total += item.quantity * item.price;
        return {
            productId: item.id,
            quantity: item.quantity,
            subTotal: item.price * item.quantity,
            color: item.color,
            storage: item.storage
        };
    });
    function generateOrderCode(): string {
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        return `ORD-${randomNumber}`;
    }
    const order = await prisma.order.create({
        data: {
            userId,
            paymentMethod: payload.paymentMethod,
            billingDetails: payload.billingDetails,
            totalPrice: total,
            orderCode: generateOrderCode(),
            items: { create: orderItems },
        },
        include: { items: true },
    });

   const productRows = payload.products
  .map(
    (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${products.find((product) => product.id === item.id)?.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item?.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">$${item?.price?.toFixed(2)}</td>
    </tr>
  `
  )
  .join("");

  const toCustomer = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);"
          >
            <!-- Header -->
            <tr>
              <td style="background-color: #2563eb; color: #ffffff; text-align: center; padding: 24px;">
                <h1 style="margin: 0; font-size: 24px;">🛍️ Order Confirmation</h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 24px; color: #333333;">
                <p style="font-size: 16px; margin: 0 0 8px 0;">Hello <strong>${user.name}</strong>,</p>
                <p style="font-size: 15px; margin: 0 0 16px 0;">
                  Thank you for your order! Here’s a summary of your purchase:
                </p>
              </td>
            </tr>

            <!-- Product Table -->
            <tr>
              <td style="padding: 0 24px 24px 24px;">
                <table
                  cellspacing="0"
                  cellpadding="8"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse; font-size: 14px;"
                >
                  <thead>
                    <tr style="background-color: #f1f5f9; text-align: left;">
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Product</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Total -->
            <tr>
              <td style="padding: 0 24px 24px 24px; text-align: right;">
                <p style="font-size: 16px; margin: 0;">
                  <strong>Total:</strong> $${order.totalPrice.toFixed(2)}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; text-align: center; padding: 16px; color: #6b7280; font-size: 13px;">
                <p style="margin: 4px 0;">Thank you for shopping with <strong>Techon</strong>!</p>
                <p style="margin: 4px 0;">If you have any questions, contact us at 
                <a href="mailto:${config.admin_mail}" style="color:#2563eb; text-decoration:none;">${config.admin_mail}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
  const toAdmin = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);"
          >
            <!-- Header -->
            <tr>
              <td style="background-color: #2563eb; color: #ffffff; text-align: center; padding: 24px;">
                <h1 style="margin: 0; font-size: 24px;">🛍️ Order Confirmation</h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 24px; color: #333333;">
                <p style="font-size: 16px; margin: 0 0 8px 0;">Hello <strong>Admin</strong>,</p>
                <p style="font-size: 15px; margin: 0 0 16px 0;">
                  New Order has been placed! Here’s a summary of your purchase:
                </p>
              </td>
            </tr>

            <!-- Product Table -->
            <tr>
              <td style="padding: 0 24px 24px 24px;">
                <table
                  cellspacing="0"
                  cellpadding="8"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse; font-size: 14px;"
                >
                  <thead>
                    <tr style="background-color: #f1f5f9; text-align: left;">
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Product</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Total -->
            <tr>
              <td style="padding: 0 24px 24px 24px; text-align: right;">
                <p style="font-size: 16px; margin: 0;">
                  <strong>Total:</strong> $${order.totalPrice.toFixed(2)}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; text-align: center; padding: 16px; color: #6b7280; font-size: 13px;">
                <p style="margin: 4px 0;">Thank you for shopping with <strong>Techon</strong>!</p>
                <p style="margin: 4px 0;">If you have any questions, contact us at 
                <a href="mailto:${config.admin_mail}" style="color:#2563eb; text-decoration:none;">${config.admin_mail}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`


    sendOrderConfirmation(user.email, toCustomer);
    sendOrderConfirmation(config.admin_mail, toAdmin);
    return order;
};

const createSingleOrder = async (userId: string, payload: any) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const product = await prisma.product.findUnique({
        where: { id: payload.productId },
    });
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    function generateOrderCode(): string {
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        return `ORD-${randomNumber}`;
    }
    const price = ((product.priceStorage as any)!.find((item: { storage: string; price: number; }) => item.storage === payload.storage)?.price || 0) * payload.quantity;
    const order = await prisma.order.create({
        data: {
            userId,
            paymentMethod: payload.paymentMethod,
            billingDetails: payload.billingDetails,
            totalPrice: price,
            orderCode: generateOrderCode(),
            items: { create: { productId: product.id, quantity: payload.quantity, subTotal: price, color: payload.color, storage: payload.storage } },
        },
        include: { items: true },
    });

   const toCustomer = `
   <!DOCTYPE html>
   <html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);"
          >
            <!-- Header -->
            <tr>
              <td style="background-color: #2563eb; color: #ffffff; text-align: center; padding: 24px;">
                <h1 style="margin: 0; font-size: 24px;">🛍️ Order Confirmation</h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 24px; color: #333333;">
                <p style="font-size: 16px; margin: 0 0 8px 0;">Hello <strong>${user.name}</strong>,</p>
                <p style="font-size: 15px; margin: 0 0 16px 0;">
                  Thank you for your order! Here’s a summary of your purchase:
                </p>
              </td>
            </tr>

            <!-- Product Table -->
            <tr>
              <td style="padding: 0 24px 24px 24px;">
                <table
                  cellspacing="0"
                  cellpadding="8"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse; font-size: 14px;"
                >
                  <thead>
                    <tr style="background-color: #f1f5f9; text-align: left;">
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Product</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${product?.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${payload?.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">$${price?.toFixed(2)}</td>
    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Total -->
            <tr>
              <td style="padding: 0 24px 24px 24px; text-align: right;">
                <p style="font-size: 16px; margin: 0;">
                  <strong>Total:</strong> $${order?.totalPrice.toFixed(2)}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; text-align: center; padding: 16px; color: #6b7280; font-size: 13px;">
                <p style="margin: 4px 0;">Thank you for shopping with <strong>Techon</strong>!</p>
                <p style="margin: 4px 0;">If you have any questions, contact us at 
                <a href="mailto:${config.admin_mail}" style="color:#2563eb; text-decoration:none;">${config.admin_mail}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const toAdmin = `
   <!DOCTYPE html>
   <html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);"
          >
            <!-- Header -->
            <tr>
              <td style="background-color: #2563eb; color: #ffffff; text-align: center; padding: 24px;">
                <h1 style="margin: 0; font-size: 24px;">🛍️ Order Confirmation</h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 24px; color: #333333;">
                <p style="font-size: 16px; margin: 0 0 8px 0;">Hello <strong>Admin</strong>,</p>
                <p style="font-size: 15px; margin: 0 0 16px 0;">
                  New order has been placed! Here’s a summary of your purchase:
                </p>
              </td>
            </tr>

            <!-- Product Table -->
            <tr>
              <td style="padding: 0 24px 24px 24px;">
                <table
                  cellspacing="0"
                  cellpadding="8"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse; font-size: 14px;"
                >
                  <thead>
                    <tr style="background-color: #f1f5f9; text-align: left;">
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Product</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                      <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${product?.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${payload?.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">$${price?.toFixed(2)}</td>
    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Total -->
            <tr>
              <td style="padding: 0 24px 24px 24px; text-align: right;">
                <p style="font-size: 16px; margin: 0;">
                  <strong>Total:</strong> $${order?.totalPrice.toFixed(2)}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; text-align: center; padding: 16px; color: #6b7280; font-size: 13px;">
                <p style="margin: 4px 0;">Thank you for shopping with <strong>Techon</strong>!</p>
                <p style="margin: 4px 0;">If you have any questions, contact us at 
                <a href="mailto:${config.admin_mail}" style="color:#2563eb; text-decoration:none;">${config.admin_mail}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

    sendOrderConfirmation(user.email, toCustomer);
    sendOrderConfirmation(config.admin_mail, toAdmin);
    return order;
};

const getMyOrders = async (userId: string, page: number, limit: number) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        select: {
            id: true,
            orderCode: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
            items: {
                select: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            priceStorage: true,
                            category: true,
                        },
                    },
                    quantity: true,
                    color: true,
                    storage: true
                },
            }
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
    const pendingOrders = await prisma.order.count({ where: { userId, status: OrderStatus.PENDING } });
    const totalSpent = await prisma.order.aggregate({
        where: { userId },
        _sum: { totalPrice: true },
    });
    return {
        page,
        limit,
        totalPage: Math.ceil(orders.length / limit),
        totalOrders: orders.length,
        pendingOrders,
        totalSpent,
        orders
    }
};

// Admin: get all orders (with filters)
const getAllOrders = async (status: OrderStatus, page: number, limit: number) => {
    const orders = await prisma.order.findMany({
        where: { status },
        select: {
            id: true,
            orderCode: true,
            status: true,
            totalPrice: true,
            billingDetails: true,
            paymentMethod: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    name: true,
                },
            },
            items: {
                select: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            priceStorage: true,
                            category: true,
                        },
                    },
                    quantity: true,
                    color: true,
                    storage: true

                },
            },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
    return {
        page,
        limit,
        totalPage: Math.ceil(await prisma.order.count() / limit),
        totalData: orders.length,
        orders
    }
};

// Admin: update order status
const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const validStatuses: OrderStatus[] = [
        OrderStatus.PENDING,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
        OrderStatus.REJECTED,
    ];

    if (!validStatuses.includes(status)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid status");
    }

    return prisma.order.update({
        where: { id: orderId },
        data: { status },
        select: {
            id: true,
            orderCode: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
            items: {
                select: {
                    productId: true,
                    quantity: true,
                    subTotal: true,
                },
            },
        },
    });
};

const getOrderDetails = async (orderId: string) => {
    return prisma.order.findUnique({
        where: { id: orderId },
        select: {
            id: true,
            totalPrice: true,
            paymentMethod: true,
            billingDetails: true,
            items: {
                select: {
                    quantity: true,
                    color: true,
                    storage: true,
                    subTotal: true,
                    product: {
                        select: {
                            name: true,
                            priceStorage: true,
                        }
                    }
                },
            },
        },
    });
};

const overView = async (year: number) => {
    if (!year) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Year is required");
    }
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    // Fetch all bookings for that year
    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: startOfYear,
                lte: endOfYear,
            },
        },
        select: {
            createdAt: true,
            totalPrice: true,
        },
    });

    // Create 12-month array and count bookings per month
    const monthly = Array.from({ length: 12 }, (_, i) => {
        const monthlyOrders = orders.filter(
            (b) => b.createdAt.getUTCMonth() === i
        );

        return {
            month: dayjs().month(i).format('MMM'),
            count: monthlyOrders.reduce((total, order) => total + order.totalPrice, 0),
        };
    });

    const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);
    const avgRevenue = totalRevenue / orders.length;
    return {
        totalOrders: orders.length,
        totalRevenue,
        avgOrderValue: avgRevenue,
        monthly,
    };
}

export const OrderServices = {
    createOrderFromCart,
    getMyOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderDetails,
    overView,
    createSingleOrder
};