import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    const user = await AuthService.register({
      email,
      password,
      username,
      firstName,
      lastName,
    });

    const { tokens } = await AuthService.login(email, password);
    AuthService.setTokenCookies(res, tokens);

    // Remove password from response
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
    const { email, password } = req.body;
    const { user, tokens } = await AuthService.login(email, password);

    AuthService.setTokenCookies(res, tokens);

    // Remove password from response
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
