import { StatusCodes } from "http-status-codes"
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors"
import { getImageUrls } from "../../helper/uploadFile"
import { Prisma } from "@prisma/client"

const createCategory = async (category: string) => {
  const categoryExists = await prisma.category.findFirst({
    where: {
      name: category
    }
  })
  if (categoryExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category already exists")
  }
  const result = await prisma.category.create({
    data: {
      name: category
    }
  })
  return result
}

const getCategories = async () => {
  const result = await prisma.category.findMany()
  return result
}

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id
    }
  })
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found")
  }
  const result = await prisma.category.delete({
    where: {
      id
    }
  })
  return result
}

const createProduct = async (payload: any, productImages: any) => {
  const imageUrl = productImages?.length > 0 ? await getImageUrls(productImages) : []
  const category = await prisma.category.findFirst({
    where: {
      name: payload.category
    }
  })
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Invalid category name")
  }
  const result = await prisma.product.create({
    data: {
      ...payload,
      images: imageUrl ?? undefined
    }
  })
  return result
}

type PriceStorageItem = {
  storage: string;
  price: number;
};

const getProducts = async (
  page: number,
  limit: number,
  category?: string,
  sortBy?: "l2h" | "h2l",
  tag?: string,
  maxPrice?: number,
  search?: string
) => {

  if (search) {
    const result = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive"
            },
          },
          {
            title: {
              contains: search,
              mode: "insensitive"
            },
          }
        ]
      },
      select: {
        id: true,
        name: true,
        priceStorage: true,
        images: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: limit
    });
    const temp = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive"
        },
        title: {
          contains: search,
          mode: "insensitive"
        },
        description: {
          contains: search,
          mode: "insensitive"
        }
      }
    })
    return {
      meta: {
        page,
        limit,
        total: temp.length,
        totalPage: Math.ceil(temp.length / limit),
      },
      data: result,
    };
  }
  else {

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (tag) {
      whereClause.OR = [
        {
          tags: {
            has: tag
          }
        },
      ];
    }

    // Fetch all matching products
    let products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        priceStorage: true,
        images: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Transform priceStorage and filter by maxPrice
    const transformed = products
      .map((p) => {
        // cast priceStorage to correct type
        const priceStorageArr = p.priceStorage as PriceStorageItem[];

        const prices = priceStorageArr.map((item) => item.price);
        const minPrice = Math.min(...prices);

        return {
          ...p,
          minPrice,
        };
      })
      .filter((p) => (maxPrice ? p.minPrice <= maxPrice : true));

    // Sort
    if (sortBy === "l2h") {
      transformed.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === "h2l") {
      transformed.sort((a, b) => b.minPrice - a.minPrice);
    } else {
      transformed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Pagination
    const total = transformed.length;
    const paginated = transformed.slice((page - 1) * limit, page * limit);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
      data: paginated,
    };
  }
};

const productDetails = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: {
      id
    }
  })
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
  }
  return result
}

const updateProduct = async (id: string, payload: any, images: any) => {
  const imageUrls = images?.length > 0 ? await getImageUrls(images) : []
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
  }
  const result = await prisma.product.update({
    where: {
      id
    },
    data: {
      ...payload,
      images: imageUrls.length > 0 ? imageUrls : undefined
    }
  })
  return result
}

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
  }
  const result = await prisma.product.delete({
    where: {
      id
    }
  })
  return result
}

const getAllCommonTags = async () => {
  // 1. Fetch only tags field from all products
  const products = await prisma.product.findMany({
    select: {
      tags: true,
    },
  });

  // 2. Flatten all tags into one array
  const allTags = products.flatMap((p) => p.tags || []);

  // 3. Deduplicate
  const uniqueTags = [...new Set(allTags)];

  return uniqueTags;
};

const getRelatedProducts = async (productId: string, page: number, limit: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  })
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
  }
  const result = await prisma.product.findMany({
    where: {
      category: { contains: product.category, mode: "insensitive" },
      id: {
        not: productId
      }
    },
    skip: (page - 1) * limit,
    take: limit,
  })
  const total = await prisma.product.count()
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
}

const getBestSellingProducts = async (page: number, limit: number = 10) => {
  // Step 1: Aggregate order items by productId (to identify best-sellers)
  const bestSellers = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    skip: (page - 1) * limit,
    take: limit,
  });

  if (bestSellers.length === 0) {
    return {
      meta: { page, limit, total: 0, totalPage: 0 },
      data: [],
    };
  }

  // Step 2: Extract product IDs
  const productIds = bestSellers.map((item) => item.productId);

  // Step 3: Fetch products with their reviews
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      priceStorage: true,
      images: true,
      category: true,
      Review: {
        select: { rating: true },
      },
    },
  });

  // Step 4: Calculate average rating for each product
  const result = products.map((product) => {
    const ratings = product.Review.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    return {
      id: product.id,
      name: product.name,
      priceStorage: product.priceStorage,
      images: product.images,
      category: product.category,
      averageRating: Number(averageRating.toFixed(1)),
    };
  });

  // Step 5: Return structured response
  return {
    meta: {
      page,
      limit,
      total: bestSellers.length,
      totalPage: Math.ceil(bestSellers.length / limit),
    },
    data: result,
  };
};

export const productServices = {
  createCategory,
  getCategories,
  deleteCategory,
  createProduct,
  getProducts,
  productDetails,
  updateProduct,
  deleteProduct,
  getAllCommonTags,
  getRelatedProducts,
  getBestSellingProducts
}
