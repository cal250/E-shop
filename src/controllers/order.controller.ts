import { Request, Response } from 'express';
import { PrismaClient as prisma } from '@prisma/client'; // Make sure you have this prisma client configuration

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.Order.findMany(); // Use the correct case 'Order'
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get single order by ID
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prisma.Order.findUnique({ // Use the correct case 'Order'
            where: { id: req.params.id }
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

// Create new order
export const createOrder = async (req: Request, res: Response) => {
    try {
        const savedOrder = await prisma.Order.create({ // Use the correct case 'Order'
            data: req.body
        });
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    try {
        const updatedOrder = await prisma.Order.update({ // Use the correct case 'Order'
            where: { id: req.params.id },
            data: req.body
        });
        res.status(200).json(updatedOrder);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).json({ message: 'Error updating order', error });
    }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
    try {
        await prisma.Order.delete({ // Use the correct case 'Order'
            where: { id: req.params.id }
        });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).json({ message: 'Error deleting order', error });
    }
};
