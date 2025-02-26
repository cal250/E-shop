import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../types/order.types';

// Create an instance of OrderService
const orderService = new OrderService();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const orderData: CreateOrderDto = req.body;
        const result = await orderService.createOrder(orderData);
        
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getOrder = async (req: Request, res: Response) => {
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
    }
};

