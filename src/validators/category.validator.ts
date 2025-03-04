import { z } from 'zod';

// Validator for CreateCategoryDto
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(100),
    description: z.string().max(500).optional(),
});


export const updateCategorySchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export const categoryQuerySchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
    search: z.string().optional(),
    sortBy: z.enum(['name', 'createdAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const categoryIdSchema = z.object({
    id: z.number().int().positive(),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type CategoryQuerySchema = z.infer<typeof categoryQuerySchema>;
export type CategoryIdSchema = z.infer<typeof categoryIdSchema>;