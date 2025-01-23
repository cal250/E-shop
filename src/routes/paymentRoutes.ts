import express, { Request, Response } from 'express'; // Make sure to import Request and Response from 'express'
import { createPaymentIntent } from '../controllers/paymentController';

const router = express.Router();

// Ensure your route handler has the correct types
router.post("/payment-intent", async (req: Request, res: Response) => {
  await createPaymentIntent(req, res); // Call your controller function
});

export default router;
