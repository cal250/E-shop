import { PrismaClient } from "@prisma/client";
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductFiltersSchema,
} from "../validators/product.validators";

import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductResponse,
  CreateFullProductDTO,
} from "../types/product.types";

export class ProductService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createProduct(data: CreateProductSchema): Promise<ProductResponse> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        summary: data.summary,
        cover: data.cover,
        categoryId: data.categoryId,
        subCategories: {
          connect: data.subCategories?.map((id) => ({ id })) || [],
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        productSkus: {
          select: {
            id: true,
            sku: true,
            price: true,
            quantity: true,
            sizeAttribute: {
              select: {
                value: true,
              },
            },
            colorAttribute: {
              select: {
                value: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            userId: true,
          },
        },
      },
    });

    const averageRating = product.reviews?.length
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : undefined;

    return { ...product, averageRating };
  }

  async updateProduct(data: UpdateProductSchema): Promise<ProductResponse> {
    const updateData: any = { ...data };
    delete updateData.id;

    //@ts-expect-error - dynamic property
    if (data.subCategories) {
      updateData.subCategories = {
        //@ts-expect-error - dynamic property
        set: data.subCategories.map((id) => ({ id })),
      };
    }

    const product = await this.prisma.product.update({
      where: { id: data.id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        productSkus: {
          select: {
            id: true,
            sku: true,
            price: true,
            quantity: true,
            sizeAttribute: {
              select: {
                value: true,
              },
            },
            colorAttribute: {
              select: {
                value: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            userId: true,
          },
        },
      },
    });

    const averageRating = product.reviews?.length
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : undefined;

    return { ...product, averageRating };
  }

  async deleteProduct(id: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getProductById(id: number): Promise<ProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        productSkus: {
          select: {
            id: true,
            sku: true,
            price: true,
            quantity: true,
            sizeAttribute: {
              select: {
                value: true,
              },
            },
            colorAttribute: {
              select: {
                value: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            userId: true,
          },
        },
      },
    });

    if (!product) return null;

    const averageRating = product.reviews?.length
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : undefined;

    return { ...product, averageRating };
  }

  async getProducts(
    filters: ProductFiltersSchema
  ): Promise<{ products: ProductResponse[]; total: number }> {
    const where: any = {
      deletedAt: null,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.subCategoryId) {
      where.subCategories = {
        some: {
          id: filters.subCategoryId,
        },
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.minPrice || filters.maxPrice) {
      where.productSkus = {
        some: {
          AND: [
            filters.minPrice
              ? { price: { gte: filters.minPrice.toString() } }
              : {},
            filters.maxPrice
              ? { price: { lte: filters.maxPrice.toString() } }
              : {},
          ],
        },
      };
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        productSkus: {
          select: {
            id: true,
            sku: true,
            price: true,
            quantity: true,
            sizeAttribute: {
              select: {
                value: true,
              },
            },
            colorAttribute: {
              select: {
                value: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            userId: true,
          },
        },
      },
      orderBy: filters.sortBy
        ? {
            [filters.sortBy]: filters.sortOrder || "asc",
          }
        : undefined,
      skip: filters.page
        ? (filters.page - 1) * (filters.limit || 10)
        : undefined,
      take: filters.limit || 10,
    });

    const total = await this.prisma.product.count({ where });

    const productsWithRating = products.map((product) => ({
      ...product,
      averageRating: product.reviews?.length
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length
        : undefined,
    }));

    return {
      products: productsWithRating,
      total,
    };
  }

  async createFullProduct(data: CreateFullProductDTO) {
    //@ts-expect-error  idk why the compiler complains about the function though it works and is in the documentation
    return this.prisma.$transaction(async (tx) => {
      const attribute = await tx.productAttribute.findUnique({
        where: {
          type: "size",
          value: data.variants[0].size,
        },
      });

      const product = await tx.product.create({
        data: {
          ...data.product,
          subCategories: {
            connect: data.product.subCategories?.map((id) => ({ id })) || [],
          },
        },
      });
      
      const skus = await tx.productSku.createMany({
        data: data.variants.map((variant) => ({
          productId: product.id,
          sizeAttributeId: attribute.id,
          sku: `${product.name}-${variant.size}`.toUpperCase(),
          price: variant.price,
          quantity: variant.quantity,
        })),
      });

      return { product, skus };
    });
  }
}
