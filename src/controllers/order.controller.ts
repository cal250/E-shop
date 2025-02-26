import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../types/order.types';

// Create an instance of OrderService
const orderService = new OrderService();


export const getOrder = async (req: Request, res: Response) => {
// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = parseInt(req.params.id);
        const result = await orderService.getOrder(orderId);

        return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await orderService.getAllOrders(page, limit);

        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const updateData: UpdateOrderStatusDto = {
            orderId: parseInt(req.params.id),
            status: req.body.status
        };
        
        const result = await orderService.updateOrderStatus(updateData);

        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
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
