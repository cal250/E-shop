import { Prisma } from '@prisma/client';
import prisma from '../utils/db';
import {
  CreateOrderDto,
  OrderDetail,
  OrderResponse,
  OrderListResponse,
  UpdateOrderStatusDto,
} from "../types/order.types";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator";

export class OrderService {
  async createOrder(orderData: CreateOrderDto): Promise<OrderResponse> {
    try {
      const validatedData = createOrderSchema.parse(orderData);
      
     /// @ts-ignore 
      const order = await prisma.$transaction(async (tx) => {

        const order = await tx.orderDetail.create({
          data: {
            paymentId: -1,
            userId: validatedData.userId,
            total: validatedData.payment.amount,
            payment: {
              create: {
                amount: validatedData.payment.amount,
                provider: validatedData.payment.provider,
                status: 'pending'
              }
            },
            items: {
              create: validatedData.items.map(item => ({
                productId: item.productId,
                productsSkuId: item.productsSkuId,
                quantity: item.quantity
              }))
            }
          },
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            items: {
              include: {
                product: true,
                productSku: true
              }
            },
            payment: true
          }
        });

        return order;
      });

      return {
        success: true,
        //@ts-ignore
        data: order ,
        message: "Order created successfully"
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          success: false,
          data: null as any,
          message: `Database error: ${error.message}`
        };
      }
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : "Failed to create order"
      };
    }
  }

  async getOrder(orderId: number): Promise<OrderResponse> {
    try {
      const order = await prisma.orderDetail.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          items: {
            include: {
              product: true,
              productSku: true
            }
          },
          payment: true
        }
      });

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        success: true,
        data: order as OrderDetail
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : "Failed to fetch order"
      };
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10): Promise<OrderListResponse> {
    try {
      const skip = (page - 1) * limit;
      const [orders, total] = await prisma.$transaction([
        prisma.orderDetail.findMany({
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            items: {
              include: {
                product: true,
                productSku: true
              }
            },
            payment: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.orderDetail.count()
      ]);

      return {
        success: true,
        data: orders as OrderDetail[],
        total
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        total: 0,
        message: error instanceof Error ? error.message : "Failed to fetch orders"
      };
    }
  }

  async updateOrderStatus(updateData: UpdateOrderStatusDto): Promise<OrderResponse> {
    try {
      const validatedData = updateOrderStatusSchema.parse(updateData);

      const order = await prisma.orderDetail.update({
        where: { id: validatedData.orderId },
        data: {
          payment: {
            update: {
              status: validatedData.status
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          items: {
            include: {
              product: true,
              productSku: true
            }
          },
          payment: true
        }
      });

      return {
        success: true,
        data: order as OrderDetail,
        message: "Order status updated successfully"
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          success: false,
          data: null as any,
          message: error.code === 'P2025' ? 'Order not found' : `Database error: ${error.message}`
        };
      }
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : "Failed to update order status"
      };
    }
  }
}
