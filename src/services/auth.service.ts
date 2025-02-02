import { PrismaClient, User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthTokens, TokenPayload } from "../types/auth.types";

const prisma = new PrismaClient();
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor() {
    this.accessTokenSecret =
      process.env.JWT_ACCESS_SECRET || "your-access-secret";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
    this.accessTokenExpiration = "15m"; // 15 minutes
    this.refreshTokenExpiration = "7d"; // 7 days
  }

  async register(userData: {
    email: string;
    password: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Promise<User> {
    const hashedPassword = await hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        role: userData.role || "USER",
        password: hashedPassword,
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: `${userData.lastName}${userData.firstName}${Math.floor(
          Math.random() * 1000
        )}`,
      },
    });

    return user;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  generateTokens(user: User): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role || "USER",
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiration,
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration,
    });

    return { accessToken, refreshToken };
  }

  setTokenCookies(res: Response, tokens: AuthTokens): void {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearTokenCookies(res: Response): void {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }

  validateAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  getTokenFromCookies(req: Request): {
    accessToken?: string;
    refreshToken?: string;
  } {
    return {
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
    const payload = this.validateRefreshToken(refreshToken);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return null;

    return this.generateTokens(user);
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid current password");
    }

    const hashedPassword = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }
}

export default new AuthService();
