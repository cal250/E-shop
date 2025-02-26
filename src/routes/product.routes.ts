import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';


import {
createProduct,
updateProduct,
deleteProduct,
getProductById,
getProducts
} from '../controllers/product.controller';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', authenticateToken, requireRole('ADMIN'), createProduct);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateProduct);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteProduct);

export default router;