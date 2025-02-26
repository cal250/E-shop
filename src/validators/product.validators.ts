import { z } from 'zod'

// Base product schema with common fields
const productBaseSchema = {
    name: z.string().min(1, 'Product name is required').max(255),
    description: z.string().max(2000).optional().nullable(),
    summary: z.string().max(500).optional().nullable(),
    cover: z.string().url('Invalid cover URL').optional().nullable(),
    categoryId: z.number().positive('Category ID must be a positive number'),
    subCategories: z.array(z.number().positive()).optional()
}

// Create product validator
export const createProductValidator = z.object({
    ...productBaseSchema
})

// Update product validator
export const updateProductValidator = z.object({
    id: z.number().positive('Product ID must be a positive number'),
    ...Object.entries(productBaseSchema).reduce((acc, [key, schema]) => ({
        ...acc,
        [key]: schema.optional()
    }), {})
})

// Product filters validator
export const productFiltersValidator = z.object({
    categoryId: z.number().positive().optional(),
    subCategoryId: z.number().positive().optional(),
    search: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    sortBy: z.enum(['price', 'name', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional()
}).refine(
    data => {
        if (data.minPrice && data.maxPrice) {
            return data.maxPrice >= data.minPrice
        }
        return true
    },
    {
        message: 'Maximum price must be greater than or equal to minimum price',
        path: ['maxPrice']
    }
)

// Delete product validator
export const deleteProductValidator = z.object({
    id: z.number().positive('Product ID must be a positive number')
})

// Get product by ID validator
export const getProductByIdValidator = z.object({
    id: z.number().positive('Product ID must be a positive number')
})

export type CreateProductSchema = z.infer<typeof createProductValidator>
export type UpdateProductSchema = z.infer<typeof updateProductValidator>
export type ProductFiltersSchema = z.infer<typeof productFiltersValidator>
export type DeleteProductSchema = z.infer<typeof deleteProductValidator>
export type GetProductByIdSchema = z.infer<typeof getProductByIdValidator>