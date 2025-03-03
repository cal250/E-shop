import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserI, UpdateUserI } from "../types/user.types";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserI = req.body;
    const user = await userService.createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
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
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await userService.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
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
      limit,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await userService.getCustomers(page, limit);
    const formattedCustomers = result.users.map((user) => ({
      id: user.id,
      name: user.firstName?.concat(" ", user?.lastName || ""),
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    }));

    return res.status(200).json({
      users: formattedCustomers,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getLoggedInUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getCurrentLoggedInUser(req);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
