import { Request, Response } from 'express';
import stripe from '../config/stripe';

// Utility function to extract error messages safely
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred.';
};

// Controller to create a payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    // Validate input
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required.' });
    }

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency,
    });

    // Return the client secret
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Handle and log the error
    const errorMessage = getErrorMessage(error);
    res.status(500).json({ error: errorMessage });
  }
};
