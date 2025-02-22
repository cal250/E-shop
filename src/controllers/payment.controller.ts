import { Request, Response } from 'express';
import stripe from '../config/stripe.config';

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


  
export const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { paymentMethodId } = req.body;

    // Log the balance for debugging (optional)
    const balance = await stripe.balance.retrieve();
    console.log(balance);

    // Retrieve the PaymentMethod from Stripe using the provided paymentMethodId
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    res.status(201).json({
      message: 'Payment method retrieved successfully',
      paymentMethod,
    });
  } catch (error) {
    // Extract the error message and respond
    const errorMessage = getErrorMessage(error);
    res.status(500).json({ error: errorMessage });
  }
};
