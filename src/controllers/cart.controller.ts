import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CartController = {
  async addItem(req: Request, res: Response) {
    try {
      const { userId, productId, productSkuId, quantity } = req.body;

      let cart = await prisma.cart.findUnique({
        where: { userId: Number(userId) },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: Number(userId), total: 0 }
          // data: { userId: Number(userId) },
        });
      }

      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: Number(productId),
          productsSkuId: Number(productSkuId),
          quantity: Number(quantity),
        },
      });

      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to add item to cart" });
    }
  },

  async getCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const cart = await prisma.cart.findUnique({
        where: { userId: Number(userId) },
        include: {
          items: {
            include: {
              product: true,
              productSku: true
            }
          // cartItems: {
          //   include: {
          //     product: true,
          //     // productSku:true
          //   },
          },
        },
      });
      res.json(cart);
    } catch (error) {
      res.status(404).json({ error: "Cart not found" });
    }
  },
};
