import { PrismaClient } from "@prisma/client";
import {
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
  SubCategory,
  SubCategoryFilters,
  SubCategoryPaginationParams,
  PaginatedSubCategoryResponse,
} from "../types/subCategory.types";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
  subCategoryFiltersSchema,
  subCategoryPaginationSchema,
  getSubCategoryByIdSchema,
  deleteSubCategorySchema,
} from "../validators/subCategory.validators";

export class SubCategoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(input: CreateSubCategoryInput): Promise<SubCategory> {
    const validated = createSubCategorySchema.parse(input);

    const category = await this.prisma.category.findFirst({
      where: { id: validated.parentId, deletedAt: null }
    });

    if (!category) {
      throw new Error("Category does not exist or has been deleted");
    }

    return this.prisma.subCategory.create({
      data: validated,
      include: {
        category: true,
      },
    });
  }

  async update(input: UpdateSubCategoryInput): Promise<SubCategory> {
    const validated = updateSubCategorySchema.parse(input);
    const { id, ...updateData } = validated;

    return this.prisma.subCategory.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async getById(id: number): Promise<SubCategory | null> {
    const validated = getSubCategoryByIdSchema.parse({ id });

    return this.prisma.subCategory.findUnique({
      where: { id: validated.id },
      include: {
        category: true,
      },
    });
  }

  async delete(id: number): Promise<SubCategory> {
    const validated = deleteSubCategorySchema.parse({ id });
    const now = new Date();

    return this.prisma.subCategory.update({
      where: { id: validated.id },
      data: { deletedAt: now },
      include: {
        category: true,
      },
    });
  }

  async findMany(
    filters: SubCategoryFilters,
    pagination: SubCategoryPaginationParams
  ): Promise<PaginatedSubCategoryResponse> {
    const validatedFilters = subCategoryFiltersSchema.parse(filters);
    const validatedPagination = subCategoryPaginationSchema.parse(pagination);

    const where = {
      ...validatedFilters,
      deletedAt: validatedFilters.includeDeleted ? undefined : null,
    };

    const [items, total] = await Promise.all([
      this.prisma.subCategory.findMany({
        where,
        include: {
          category: true,
        },
        skip: (validatedPagination.page - 1) * validatedPagination.limit,
        take: validatedPagination.limit,
        orderBy: validatedPagination.sortBy
          ? { [validatedPagination.sortBy]: validatedPagination.order }
          : undefined,
      }),
      this.prisma.subCategory.count({ where }),
    ]);

    return {
      items,
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }
}
