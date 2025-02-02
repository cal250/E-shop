import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = AuthService.getTokenFromCookies(req);
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "No  tokens not found" });
    }

    if (accessToken) {
      const payload = AuthService.validateAccessToken(accessToken);
      if (payload) {
        req.user = payload;
        return next();
      }
    }

    // If access token is invalid but refresh token exists, try to refresh tokens
    if (refreshToken) {
      const newTokens = await AuthService.refreshTokens(refreshToken);
      if (newTokens) {
        AuthService.setTokenCookies(res, newTokens);
        const newPayload = AuthService.validateAccessToken(
          newTokens.accessToken
        );
        if (newPayload) {
          req.user = newPayload;
          return next();
        }
      }
    }

    return res.status(401).json({ message: "Invalid token" });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};
