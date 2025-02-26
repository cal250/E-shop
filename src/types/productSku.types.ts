import { Product } from './product.types'

export interface ProductSku {
    id: number
    productId: number
    sizeAttributeId: number
    colorAttributeId: number
    sku: string
    price: string
    quantity: number
    createdAt: Date
    deletedAt?: Date | null
    product?: Product
    sizeAttribute: {
        id: number
        value: string
    }
    colorAttribute: {
        id: number
        value: string
    }
}

export interface CreateProductSkuInput {
    productId: number
    sizeAttributeId: number
    colorAttributeId: number
    sku: string
    price: string
    quantity: number
}

export interface UpdateProductSkuInput {
    id: number
    sizeAttributeId?: number
    colorAttributeId?: number
    sku?: string
    price?: string
    quantity?: number
}

export interface ProductSkuFilters {
    productId?: number
    sizeAttributeId?: number
    colorAttributeId?: number
    minPrice?: string
    maxPrice?: string
    inStock?: boolean
    sortBy?: 'price' | 'quantity' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
}