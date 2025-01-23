import express from 'express';
import dotenv from 'dotenv';
import paymentRoutes from './src/routes/paymentRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/payments', paymentRoutes);
app.use('/api/createpayment',paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
