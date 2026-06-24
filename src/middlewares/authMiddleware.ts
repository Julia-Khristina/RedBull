import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { AuthAdmin } from "../models/auth";
import { UnauthorizedError } from "../errors/AppError";

declare global {
  namespace Express {
    interface Request {
      admin?: AuthAdmin;
    }
  }
}

export async function garantirAutenticacao(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token: string | null = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token && req.cookies?.rb24_token) {
    token = req.cookies.rb24_token;
  }

  if (!token) {
    if (req.accepts("html")) {
      res.redirect("/admin/login");
      return;
    }
    throw new UnauthorizedError("Token não fornecido");
  }

  try {
    req.admin = await authService.validateToken(token);
    next();
  } catch {
    if (req.accepts("html")) {
      res.redirect("/admin/login");
      return;
    }
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
