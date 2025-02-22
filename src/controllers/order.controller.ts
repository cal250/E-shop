import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get single order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const savedOrder = await prisma.order.create({
            data: req.body
        });
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

// Update order
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.status(200).json(updatedOrder);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(500).json({ message: 'Error updating order', error });
    }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.order.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(500).json({ message: 'Error deleting order', error });
    }
};
