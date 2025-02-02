import { z } from 'zod'

// Enum for attribute types
export const AttributeTypeEnum = z.enum(['color', 'size'])

// Base attribute validation schema
const attributeBaseSchema = z.object({
    type: AttributeTypeEnum,
    value: z.string().min(1, 'Value is required'),
})

// Create Product Attribute validator
export const createProductAttributeSchema = attributeBaseSchema

// Update Product Attribute validator
export const updateProductAttributeSchema = z.object({
    id: z.number().int().positive('ID must be a positive integer'),
    type: AttributeTypeEnum.optional(),
    value: z.string().min(1, 'Value is required').optional(),
    // ...z.partial(attributeBaseSchema)
})

// Delete Product Attribute validator
export const deleteProductAttributeSchema = z.object({
    id: z.number().int().positive('ID must be a positive integer')
})

// Get Product Attribute validator
export const getProductAttributeSchema = z.object({
    id: z.number().int().positive('ID must be a positive integer')
})

// Query filters for Product Attributes
export const productAttributeFiltersSchema = z.object({
    type: AttributeTypeEnum.optional(),
    search: z.string().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).optional().default(10),
    sortBy: z.enum(['type', 'value', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
})

// Types based on the schemas
export type CreateProductAttributeInput = z.infer<typeof createProductAttributeSchema>
export type UpdateProductAttributeInput = z.infer<typeof updateProductAttributeSchema>
export type ProductAttributeFilters = z.infer<typeof productAttributeFiltersSchema>