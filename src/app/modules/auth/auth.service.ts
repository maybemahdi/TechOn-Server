import { PrismaClient, Role } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { jwtHelpers } from "../../helper/jwtHelper";
import { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../../error/ApiErrors";
import { OTPFn } from "../../helper/OTPFn";
import OTPVerify from "../../helper/OTPVerify";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const logInFromDB = async (payload: {
  email: string;
  password: string;
  fcmToken?: string;
}) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!findUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const comparePassword = await compare(payload.password, findUser.password);
  if (!comparePassword) {
    throw new ApiError(
      StatusCodes.NON_AUTHORITATIVE_INFORMATION,
      "Invalid password"
    );
  }

  if (findUser.status === "PENDING" && !findUser.isVerified) {
    OTPFn(findUser.email);
    throw new ApiError(
      401,
      "Please check your email address to verify your account"
    );
  }
  if (findUser.status === "BLOCKED") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Your account has been blocked"
    );
  }
  if (payload.fcmToken) {
    await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        fcmToken: payload.fcmToken,
      },
    });
  }


  let cart = await prisma.cart.findUnique({ where: { userId: findUser.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: findUser.id } });
  }


  const userInfo = {
    email: findUser.email,
    name: findUser.name,
    id: findUser.id,
    role: findUser.role,
    status: findUser.status,
    fcmToken: findUser.fcmToken,
    cartId: cart.id
  };
  const token = jwtHelpers.generateToken(userInfo, { expiresIn: "30d" });
  return { accessToken: token, ...userInfo };
};

const verifyOtp = async (payload: { email: string; otp: number; type?: string }) => {
  if (payload.type === "SIGNUP") {

    const { message, accessToken } = await OTPVerify({ ...payload, time: "24h" });

    if (message) {
      const updateUserInfo = await prisma.user.update({
        where: {
          email: payload.email,
        },
        data: {
          status: "ACTIVE",
          isVerified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { accessToken, ...updateUserInfo };
    }
  }
  if (payload.type === "FORGET") {
    const { accessToken } = await OTPVerify({ ...payload, time: "1h" });

    return { accessToken };
  }

};

const forgetPassword = async (payload: { email: string }) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!findUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  OTPFn(findUser.email);
  return;
};

const resendOtp = async (payload: { email: string }) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!findUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  OTPFn(findUser.email);
};

const socialLogin = async (payload: {
  email: string;
  name: string;
  role: Role;
  image?: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email.trim(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (userData) {
    const accessToken = jwtHelpers.generateToken(
      { id: userData.id, email: userData.email, role: userData.role },
      { expiresIn: "30d" }
    );
    return {
      ...userData,
      accessToken,
    };
  } else {
    const result = await prisma.user.create({
      data: {
        ...payload,
        password: "",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const accessToken = jwtHelpers.generateToken(
      { id: result.id, email: result.email, role: result.role },
      { expiresIn: "30d" }
    );
    return {
      ...result,
      accessToken,
    };
  }
};

const resetPassword = async (payload: { token: string; password: string }) => {
  const { email } = jwtHelpers.tokenDecoder(payload.token) as JwtPayload;

  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!findUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const hashedPassword = await hash(payload.password, 10);
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};

export const authService = {
  logInFromDB,
  forgetPassword,
  verifyOtp,
  resendOtp,
  socialLogin,
  resetPassword,
};
