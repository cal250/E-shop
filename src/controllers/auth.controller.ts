import e, { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { User } from "@prisma/client";

export async function register(req: Request, res: Response) {
  try {
    const { emailPhoneNumberString, password, firstName, lastName, role } =
      req.body;

    if (
      !emailPhoneNumberString ||
      !password ||
      !firstName ||
      !lastName
    ) {
      const missingFields = [];
      if (!emailPhoneNumberString) missingFields.push('email/phone number');
      if (!password) missingFields.push('password');
      if (!firstName) missingFields.push('first name');
      if (!lastName) missingFields.push('last name');

      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberValidator = /^[0-9]{10}$/;
    let user: User | null = null;

    let email, phoneNumber;
    if (emailValidator.test(emailPhoneNumberString)) {
      email = emailPhoneNumberString;
    } else if (phoneNumberValidator.test(emailPhoneNumberString)) {
      phoneNumber = emailPhoneNumberString;
    } else {
      return res.status(400).json({
        message: "Invalid email or phone number",
      });
    }
    if (email) {
      user = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        role,
      });
    } else if (phoneNumber) {
      user = await AuthService.register({
        phoneNumber: phoneNumber,
        password,
        firstName,
        lastName,
        role,
      });
    }

    const { tokens } = await AuthService.login(email, password);
    AuthService.setTokenCookies(res, tokens);

    if (!user) {
      return res.status(500).json({
        message: "User registration failed",
      });
    }
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { emailPhoneNumberString, password } = req.body;
    const { user, tokens } = await AuthService.login(
      emailPhoneNumberString,
      password
    );

    AuthService.setTokenCookies(res, tokens);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Login failed",
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    AuthService.clearTokenCookies(res);
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = AuthService.getTokenFromCookies(req);

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const newTokens = await AuthService.refreshTokens(refreshToken);

    if (!newTokens) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    AuthService.setTokenCookies(res, newTokens);

    return res.status(200).json({
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Token refresh failed",
    });
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    await AuthService.changePassword(userId, oldPassword, newPassword);

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Password change failed",
    });
  }
}

export async function isLoggedIn(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await AuthService.isLoggedIn(req);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed  check login status",
    });
  }
}
