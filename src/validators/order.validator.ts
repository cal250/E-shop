import { z } from 'zod';

// Validator for CreateOrderItemDto
export const createOrderItemSchema = z.object({
    productId: z.number().positive(),
    productsSkuId: z.number().positive(),
    quantity: z.number().positive(),
});

// Validator for CreateOrderDto
export const createOrderSchema = z.object({
    userId: z.number().positive(),
    items: z.array(createOrderItemSchema).nonempty(),
    payment: z.object({
        amount: z.number().positive(),
        provider: z.string().min(1),
    }),
});

// Validator for UpdateOrderStatusDto
export const updateOrderStatusSchema = z.object({
    orderId: z.number().positive(),
    status: z.string().min(1),
});

// Validator for OrderResponse
export const orderResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        id: z.number(),
        userId: z.number(),
        paymentId: z.number(),
        total: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        user: z.object({
            id: z.number(),
            email: z.string().email(),
        }),
        items: z.array(z.object({
            id: z.number(),
            orderId: z.number(),
            productId: z.number(),
            productsSkuId: z.number(),
            quantity: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
            product: z.object({}).passthrough(), // Using passthrough since Product type is complex
            productSku: z.object({}).passthrough(), // Using passthrough since ProductSku type is complex
        })),
        payment: z.object({
            id: z.number(),
            orderId: z.number(),
            amount: z.number(),
            provider: z.string(),
            status: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    }),
    message: z.string().optional(),
});

// Validator for OrderListResponse
export const orderListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(orderResponseSchema.shape.data),
    total: z.number(),
    message: z.string().optional(),
});