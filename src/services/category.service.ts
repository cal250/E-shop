import { Prisma, PrismaClient } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryParams, Category } from '../types/category.types';

class CategoryService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateCategoryDto): Promise<Category> {
        return this.prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
            },
        });
    }

    async update(id: number, data: UpdateCategoryDto): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
        });
    }

    async delete(id: number): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async findById(id: number): Promise<Category | null> {
        return this.prisma.category.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                subCategories: true,
                products: true,
            }
        });
    }
    
    async findAll(params: CategoryQueryParams) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = params;
        const skip = (page - 1) * limit;
    
        const where = {
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
                    { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
                ],
            }),
        };
    
        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: order,
                },
                include: {
                    subCategories: true,
                    products: true,
                }
            }),
            this.prisma.category.count({ where }),
        ]);
    
        return {
            data: categories,
            total,
        };
    }
}

export const categoryService = new CategoryService();