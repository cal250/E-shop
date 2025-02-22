import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ProductController = {
  async getAll(_req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        // include: {
        //   productSkus: true,
        //   category: true,
        //   subCategories: true,
        // }
        include:{
          skus:true,
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          skus: {
            include: {
              // sizeAttribute: true,
              // colorAttribute: true,
            }
          },
          reviews: true,
        }
      });
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: 'Product not found' });
    }
  }
};
