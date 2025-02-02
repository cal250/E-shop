import { z } from 'zod';

// Base SubCategory validator schema
const subCategoryBaseSchema = {
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().max(500, 'Description is too long').nullable().optional(),
};

// Create SubCategory validator
export const createSubCategorySchema = z.object({
    ...subCategoryBaseSchema,
    parentId: z.number().positive('Parent category ID is required'),
});

// Update SubCategory validator
export const updateSubCategorySchema = z.object({
    id: z.number().positive('SubCategory ID is required'),
    parentId: z.number().positive('Parent category ID must be positive').optional(),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
    description: z.string().max(500, 'Description is too long').nullable().optional(),
});

// SubCategory filters validator
export const subCategoryFiltersSchema = z.object({
    id: z.number().positive().optional(),
    parentId: z.number().positive().optional(),
    name: z.string().optional(),
    includeDeleted: z.boolean().optional(),
});

// Pagination params validator
export const subCategoryPaginationSchema = z.object({
    page: z.number().positive().optional().default(1),
    limit: z.number().positive().optional().default(10),
    sortBy: z.enum(['id', 'name', 'parentId', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Get SubCategory by ID validator
export const getSubCategoryByIdSchema = z.object({
    id: z.number().positive('SubCategory ID is required'),
});

// Delete SubCategory validator
export const deleteSubCategorySchema = z.object({
    id: z.number().positive('SubCategory ID is required'),
});