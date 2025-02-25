import { ProductSku } from './productSku.types'
import { Product } from './product.types'

export interface OrderItem {
    id: number
    orderId: number
    productId: number
    productsSkuId: number
    quantity: number
    createdAt: Date
    updatedAt: Date
    product: Product
    productSku: ProductSku
}

export interface PaymentDetail {
    id: number
    orderId: number
    amount: number
    provider: string
    status: string
    createdAt: Date
    updatedAt: Date
}

export interface OrderDetail {
    id: number
    userId: number
    paymentId: number
    total: number
    createdAt: Date
    updatedAt: Date
    user: {
        id: number
        email: string
    }
    items: OrderItem[]
    payment: PaymentDetail
}

// DTOs for creating/updating orders
export interface CreateOrderItemDto {
    productId: number
    productsSkuId: number
    quantity: number
}

export interface CreateOrderDto {
    userId: number
    items: CreateOrderItemDto[]
    payment: {
        amount: number
        provider: string
    }
}

export interface UpdateOrderStatusDto {
    orderId: number
    status: string
}

export interface OrderResponse {
    success: boolean
    data: OrderDetail
    message?: string
}

export interface OrderListResponse {
    success: boolean
    data: OrderDetail[]
    total: number
    message?: string
}