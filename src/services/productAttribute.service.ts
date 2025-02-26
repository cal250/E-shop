import { PrismaClient, ProductAttribute } from "@prisma/client";
import {
  CreateProductAttributeDTO,
  UpdateProductAttributeDTO,
  ProductAttributeFilters,
  ProductAttributeResponse,
} from "../types/productAttrribute.types";
import { ProductAttributeFilters as ValidatedFilters } from "../validators/productAttribute.validator";

export class ProductAttributeService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateProductAttributeDTO): Promise<ProductAttribute> {
    return this.prisma.productAttribute.create({
      data: {
        type: data.type,
        value: data.value,
      },
    });
  }

  async bulkCreate(
    data: CreateProductAttributeDTO[]
  ): Promise<ProductAttribute[]> {
    return this.prisma.productAttribute
      .createMany({
        data: data.map((attr) => ({
          type: attr.type,
          value: attr.value,
        })),
      })
      .then(() =>
        this.prisma.productAttribute.findMany({
          where: {
            OR: data.map((attr) => ({
              AND: {
                type: attr.type,
                value: attr.value,
              },
            })),
          },
        })
      );
  }

  async update(
    id: number,
    data: UpdateProductAttributeDTO
  ): Promise<ProductAttribute> {
    return this.prisma.productAttribute.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<ProductAttribute> {
    return this.prisma.productAttribute.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findById(id: number): Promise<ProductAttributeResponse | null> {
    const attribute = await this.prisma.productAttribute.findUnique({
      where: { id },
      include: {
        skusSize: {
          select: { id: true },
        },
        skusColor: {
          select: { id: true },
        },
      },
    });

    if (!attribute) return null;

    //@ts-expect-error incompatable return types for
    return {
      ...attribute,
      skusSize: attribute.skusSize.map((sku) => sku.id),
      skusColor: attribute.skusColor.map((sku) => sku.id),
    };
  }

  async findAll(filters: ValidatedFilters): Promise<{
    data: ProductAttributeResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const where = {
      deletedAt: null,
      ...(filters.type && { type: filters.type }),
      ...(filters.search && {
        value: {
          contains: filters.search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.productAttribute.findMany({
        where,
        include: {
          skusSize: {
            select: { id: true },
          },
          skusColor: {
            select: { id: true },
          },
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: filters.sortBy
          ? {
              [filters.sortBy]: filters.sortOrder || "asc",
            }
          : undefined,
      }),
      this.prisma.productAttribute.count({ where }),
    ]);

    return {
      //@ts-expect-error incompatable return types for
      data: data.map((attr) => ({
        ...attr,
        skusSize: attr.skusSize.map((sku) => sku.id),
        skusColor: attr.skusColor.map((sku) => sku.id),
      })),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }
}
