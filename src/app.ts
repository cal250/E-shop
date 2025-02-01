
import express from 'express';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import reviewRoutes from './routes/reviews.routes';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

export default app;