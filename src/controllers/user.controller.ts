import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;
      const user = await prisma.user.create({
        data: {
          email,
          name : username,
          password,

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
          // orderDetails: true,
          orders:true
        }
      });
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  }
};
