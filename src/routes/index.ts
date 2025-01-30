import { Router } from 'express';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import categoryRoutes from './category.routes';


const router = Router();

router.use('/api/users', userRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/categories', categoryRoutes);

export default router;
