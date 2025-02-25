import { Router } from 'express';
import { 
createOrder, 
getOrder, 
getAllOrders, 
updateOrderStatus 
} from '../controllers/order.controller';

const router = Router();
router.post('/', createOrder);
router.get('/:id', getOrder);
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

export default router;