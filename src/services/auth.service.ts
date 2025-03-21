import { PrismaClient, User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthTokens, TokenPayload } from "../types/auth.types";
import prisma from "../utils/db";
import { createUserValidator } from "../validators/user.validator";
import { UserResponseI } from "../types/user.types";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenExpiration: number;

  constructor() {
    this.accessTokenSecret =
      process.env.JWT_ACCESS_SECRET || "your-access-secret";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
    this.accessTokenExpiration = 30 * 60; // 30 minutes
    this.refreshTokenExpiration = 24 * 7 * 60 ; // 7 days
  }

  async register(userData: {
    email?: string;
    password: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Promise<User> {
    createUserValidator.parse(userData);
    if (!userData.email && !userData.phoneNumber) {
      throw new Error("You must provide either email or phoneNumber");
    }
    const hashedPassword = await hash(userData.password, 10);

    const { email, phoneNumber, ...rest } = userData;

    const username = userData.email
      ? `${userData.email.split("@")[0]}${Math.floor(Math.random() * 1000)}`
      : `${userData.lastName}${userData.firstName}${Math.floor(
          Math.random() * 1000
        )}`;

    const user = await prisma.user.create({
      data: {
        ...(email ? { email } : { phoneNumber }),
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        role: userData.role || "USER",
        username,
      },
    });

    return user;
  }

  async login(
    emailPhoneNumberString: string,
    password: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const email =
      emailPhoneNumberString.includes("@") && emailPhoneNumberString;
    const phoneNumber = !email && emailPhoneNumberString;
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (phoneNumber) {
      user = await prisma.user.findFirst({ where: { phoneNumber  } });
    }
    if (!user) {
      throw new Error("User not found, invalid email or phone number");
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
     expiresIn: this.refreshTokenExpiration
    });

    return { accessToken, refreshToken };
  }

  setTokenCookies(res: Response, tokens: AuthTokens): void {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
  async isLoggedIn(
    req: AuthenticatedRequest
  ): Promise<(UserResponseI & { role: string | null }) | null> {
    const userId = req?.user?.userId;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error("user nor found");
      }
      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    }
    return null;
  }
}

export default new AuthService();
