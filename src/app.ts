import express from 'express';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import reviewRoutes from './routes/reviews.routes';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import { authenticateToken } from './middlewares/auth.middleware';
import subCategoriesRoutes from './routes/subCategory.routes';
import productAttributesRoutes from './routes/productAttribute.routes';
import orderRoutes from "./routes/order.routes"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.json());
app.use('/users',authenticateToken, userRoutes);
app.use("/auth", authRoutes);
app.use("/categories", authenticateToken, categoryRoutes);
app.use("/subcategories", authenticateToken, subCategoriesRoutes);
app.use('/products', productRoutes);
app.use("/product-attributes", authenticateToken, productAttributesRoutes);
app.use("/orders", authenticateToken, orderRoutes);

app.use('/reviews', reviewRoutes);
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

export default app;