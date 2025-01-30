import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username, firstName, lastName } = req.body;
      const user = await prisma.user.create({
        data: {
          email,
          password, // Note: Should be hashed in production
          username,
          firstName,
          lastName
        }
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'User creation failed' });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          addresses: true,
          orderDetails: true,
        }
      });
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  }
};
