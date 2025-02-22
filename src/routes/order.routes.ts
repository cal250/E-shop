import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
    getAllOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from '../controllers/order.controller';

const router = express.Router();

// Get all orders
router.get('/', authenticateToken, getAllOrders);

// Get order by ID
router.get('/:id', authenticateToken, getOrderById);

// Create new order
router.post('/', authenticateToken, createOrder);

// Update order status
router.patch('/:id', authenticateToken, updateOrder);

// Delete order
router.delete('/:id', authenticateToken, deleteOrder);

export default router;