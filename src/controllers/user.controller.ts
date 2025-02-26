import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserI, UpdateUserI } from '../types/user.types';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserI = req.body;
    const user = await userService.createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(400).json({ error: errorMessage });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(400).json({ error: errorMessage });
  }
};


export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
=======
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
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(400).json({ error: errorMessage });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userData: UpdateUserI = req.body;
    const user = await userService.updateUser(id, userData);
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(400).json({ error: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await userService.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(400).json({ error: errorMessage });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await userService.getAllUsers(page, limit);
    return res.status(200).json({
      users: result.users,
      total: result.total,
      page,
      limit
    });
  } catch (error) {
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(400).json({ error: errorMessage });
  }
};
