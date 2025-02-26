import { PrismaClient, User } from "@prisma/client";
import { CreateUserI, UpdateUserI } from "../types/user.types";
import {
  createUserValidator,
} from "../validators/user.validator";
import { hash } from "bcrypt";
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(userData: CreateUserI): Promise<User> {
    createUserValidator.parse(userData);
    const hashedPassword = await hash(userData.password, 10);

    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        username: `${userData.lastName}${userData.firstName}${Math.floor(
          Math.random() * 1000
        )}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id: number, userData: UpdateUserI): Promise<User> {
    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(
    page = 1,
    limit = 10
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total };
  }
}
