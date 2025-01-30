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

// export const addPaymentMethod = async (req: Request, res: Response) => {
//   try {
//     const { paymentMethodId, customerId } = req.body;

//     // Validate input
//     if (!paymentMethodId || !customerId) {
//       return res.status(400).json({ error: 'PaymentMethodId and CustomerId are required.' });
//     }

//     // Attach the payment method to the customer
//     const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
//       customer: customerId,
//     });

//     // Optionally set the payment method as the default for the customer
//     await stripe.customers.update(customerId, {
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });

//     res.status(200).json({
//       message: 'Payment method added successfully',
//       paymentMethod,
//     });
//   } catch (error) {
//     const errorMessage = getErrorMessage(error);
//     res.status(500).json({ error: errorMessage });
//   }
// };
  
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
