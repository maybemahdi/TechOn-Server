import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";
import { getImageUrl, getImageUrls } from "../../helper/uploadFile";

// Create Blog with parts
// const createBlog = async (data: {
//     title: string;
//     shortDesc: string;
//     coverImage?: string;
//     category: string;
//     parts: { title: string; desc: string; image?: string; order: number }[];
// }, image: any) => {
//     if (image) {
//         data.coverImage = await getImageUrl(image);
//     }

//     return prisma.blog.create({
//         data: {
//             title: data.title,
//             shortDesc: data.shortDesc,
//             coverImage: image ? data.coverImage : undefined,
//             category: data.category,
//             parts: {
//                 create: data.parts,
//             },
//         },
//         include: { parts: true },
//     });
// };

const createBlog = async (
    data: {
      title: string;
      shortDesc: string;
      category: string;
      parts: { title: string; desc: string; image?: any; index: number }[];
    },
    files: any
  ) => {
    const coverImageFile = files.find((f: any) => f.fieldname === "coverImage");
  
    // Filter part images
    const partImageFiles = files.filter((f: any) => f.fieldname.startsWith("uploadBlogImages"));
  
    const processedParts = await Promise.all(
      data.parts.map(async (part) => {
        // Extract index from fieldname like 'uploadBlogImages[0]'
        const fileForPart = partImageFiles.find((f: any) => {
          const match = f.fieldname.match(/uploadBlogImages\[(\d+)\]/);
          return match && Number(match[1]) === part.index;
        });
  
        const imageUrl = fileForPart ? await getImageUrl(fileForPart) : undefined;
  
        return {
          title: part.title,
          desc: part.desc,
          image: imageUrl,
          index: part.index,
        };
      })
    );
  
    return prisma.blog.create({
      data: {
        title: data.title,
        shortDesc: data.shortDesc,
        coverImage: coverImageFile ? await getImageUrl(coverImageFile) : undefined,
        category: data.category,
        parts: processedParts,
      },
    });
  };

// Get all blogs with category + parts
const getAllBlogs = async (page: number, limit: number, category?: string) => {
    const blogs = await prisma.blog.findMany({
        where: {
            category: category || undefined,
        },
        select: {
            id: true,
            title: true,
            shortDesc: true,
            coverImage: true,
            category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
    return {
        page,
        limit,
        totalPage: Math.ceil(await prisma.blog.count() / limit),
        totalData: blogs.length,
        blogs
    }
};

// Get single blog by ID
const getBlogById = async (id: string) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");
    }
    return blog;
};

// Update blog
const updateBlog = async (
    id: string,
    data: {
        title?: string;
        shortDesc?: string;
        coverImage?: string;
        categoryId?: string;
    }
) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");
    }
    return prisma.blog.update({
        where: { id },
        data,
    });
};

// Delete blog
const deleteBlog = async (id: string) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");
    }
    return prisma.blog.delete({ where: { id } });
};


export const blogServices = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};