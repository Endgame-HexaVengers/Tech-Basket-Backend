import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError.js";

export interface IAuthUser {
  id: string;
  email: string;
  role: string;
  branch?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export const auth = (...requiredRoles: string[]) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(
          401,
          "You are not authorized! No token provided."
        );
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new AppError(401, "Invalid authorization token!");
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new AppError(
          500,
          "JWT_SECRET  not configured!"
        );
      }

      const decoded = jwt.verify(
        token,
        secret
      ) as unknown as IAuthUser;

      req.user = decoded;

      if (
        requiredRoles.length &&
        !requiredRoles.includes(decoded.role)
      ) {
        throw new AppError(
          403,
          "You do not have permission to perform this action!"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};